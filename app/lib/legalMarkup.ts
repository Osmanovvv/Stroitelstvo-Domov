// Конвертация текста юридического документа (формат хранения: "## " — раздел,
// "### " — подраздел, "- " — пункт списка, пустая строка — абзац,
// [текст](href) — ссылка, **текст** — жирный, *текст* — курсив,
// ***текст*** — жирный курсив) в HTML для визуального редактора админки
// (TipTap) и обратно из TipTap-документа в формат хранения. Правила зеркалят
// app/components/LegalDocument.tsx (он использует parseInline отсюда) —
// рендер в редакторе и на публичной странице должен совпадать.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type InlineToken =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "em"; text: string }
  | { kind: "strongEm"; text: string }
  | { kind: "link"; label: string; href: string };

// Подчёркнутые длины {1,...} защищают от квадратичного перебора на строках
// из тысяч маркеров. Жирный/курсив внутри подписи ссылки не поддерживаются —
// подпись остаётся простым текстом.
const LINK_RE = /\[([^\]]{1,300})\]\(([^()\s]{1,300})\)/g;
const EMPHASIS_RE = /\*\*\*([^*]{1,1000})\*\*\*|\*\*([^*]{1,1000})\*\*|\*([^*]{1,1000})\*/g;

function parseEmphasis(text: string, tokens: InlineToken[]) {
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  EMPHASIS_RE.lastIndex = 0;
  while ((match = EMPHASIS_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: "text", text: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ kind: "strongEm", text: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ kind: "strong", text: match[2] });
    } else {
      tokens.push({ kind: "em", text: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ kind: "text", text: text.slice(lastIndex) });
  }
}

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parseEmphasis(text.slice(lastIndex, match.index), tokens);
    }
    tokens.push({ kind: "link", label: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parseEmphasis(text.slice(lastIndex), tokens);
  }
  return tokens;
}

function inlineToHtml(text: string): string {
  return parseInline(text)
    .map((token) => {
      switch (token.kind) {
        case "link":
          return `<a href="${escapeHtml(token.href)}">${escapeHtml(token.label)}</a>`;
        case "strong":
          return `<strong>${escapeHtml(token.text)}</strong>`;
        case "em":
          return `<em>${escapeHtml(token.text)}</em>`;
        case "strongEm":
          return `<strong><em>${escapeHtml(token.text)}</em></strong>`;
        default:
          return escapeHtml(token.text);
      }
    })
    .join("");
}

export function markupToHtml(body: string): string {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");

  const blocks: string[] = [];
  let listItems: string[] = [];
  let paraLines: string[] = [];

  const flushPara = () => {
    if (!paraLines.length) return;
    blocks.push(`<p>${inlineToHtml(paraLines.join(" "))}</p>`);
    paraLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.map((item) => `<li>${inlineToHtml(item)}</li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push(`<h2>${inlineToHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push(`<h3>${inlineToHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      flushPara();
      listItems.push(line.slice(2));
    } else if (line === "-") {
      // Недописанный маркер пункта — игнорируем (зеркалит LegalDocument).
    } else if (line === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      paraLines.push(line);
    }
  }
  flushPara();
  flushList();

  return blocks.join("");
}

// ===== TipTap-документ -> формат хранения =====

export type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: TiptapNode[];
};

const normalizeSpaces = (value: string) => value.replace(/\s+/g, " ").trim();

// href обязан проходить разбор ссылок формата хранения ([^()\s]{1,300}) —
// иначе после сохранения «ссылка» рассыпется в текст со скобками.
const isStorableHref = (href: string) => /^[^()\s]{1,300}$/.test(href);

// Прогон — отрезок текста с одинаковым оформлением. Соседние прогоны с
// одинаковыми метками склеиваются, чтобы разбитые редактором текстовые узлы
// не давали «**а****б**».
type InlineRun = { text: string; href: string | null; bold: boolean; italic: boolean };

function collectRuns(nodes: TiptapNode[] | undefined, runs: InlineRun[]) {
  if (!nodes?.length) {
    return;
  }
  for (const node of nodes) {
    if (node.type !== "text" && node.type !== "hardBreak") {
      collectRuns(node.content, runs);
      continue;
    }
    const text = node.type === "hardBreak" ? " " : (node.text ?? "");
    if (!text) {
      continue;
    }
    const marks = node.marks ?? [];
    const hrefAttr = marks.find((mark) => mark.type === "link")?.attrs?.href;
    const href = typeof hrefAttr === "string" && isStorableHref(hrefAttr) ? hrefAttr : null;
    const bold = marks.some((mark) => mark.type === "bold");
    const italic = marks.some((mark) => mark.type === "italic");

    const prev = runs[runs.length - 1];
    if (prev && prev.href === href && prev.bold === bold && prev.italic === italic) {
      prev.text += text;
    } else {
      runs.push({ text, href, bold, italic });
    }
  }
}

function inlineFromTiptap(nodes: TiptapNode[] | undefined): string {
  const runs: InlineRun[] = [];
  collectRuns(nodes, runs);

  return runs
    .map((run) => {
      // Ссылка: подпись хранится простым текстом, жирный/курсив внутри не
      // поддерживаются форматом [текст](href).
      if (run.href) {
        const label = run.text.trim();
        return label ? `[${label}](${run.href})` : "";
      }
      // Маркеры вплотную к тексту: пробельные края выносим наружу, иначе
      // "** текст **" не распарсится обратно.
      const leading = /^\s*/.exec(run.text)?.[0] ?? "";
      const trailing = /\s*$/.exec(run.text)?.[0] ?? "";
      const core = run.text.trim();
      if (!core) {
        return run.text;
      }
      let wrapped = core;
      if (run.bold && run.italic) {
        wrapped = `***${core}***`;
      } else if (run.bold) {
        wrapped = `**${core}**`;
      } else if (run.italic) {
        wrapped = `*${core}*`;
      }
      return leading + wrapped + trailing;
    })
    .join("");
}

// Пункты списка: listItem содержит абзацы (склеиваем в один пункт), а вложенные
// списки разворачиваем в плоские пункты — формат хранения вложенность не умеет.
function collectListItems(listNode: TiptapNode): string[] {
  const items: string[] = [];
  for (const li of listNode.content ?? []) {
    const ownText: string[] = [];
    const nested: string[] = [];
    for (const child of li.content ?? []) {
      if (child.type === "bulletList" || child.type === "orderedList") {
        nested.push(...collectListItems(child));
      } else {
        ownText.push(inlineFromTiptap(child.content));
      }
    }
    const text = normalizeSpaces(ownText.join(" "));
    if (text) {
      items.push(text);
    }
    items.push(...nested);
  }
  return items;
}

export function tiptapJsonToMarkup(doc: TiptapNode): string {
  const blocks: string[] = [];

  for (const node of doc.content ?? []) {
    if (node.type === "heading") {
      const text = normalizeSpaces(inlineFromTiptap(node.content));
      if (text) {
        const level = Number(node.attrs?.level) >= 3 ? "###" : "##";
        blocks.push(`${level} ${text}`);
      }
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const items = collectListItems(node);
      if (items.length) {
        blocks.push(items.map((item) => `- ${item}`).join("\n"));
      }
    } else {
      // paragraph и любые прочие блоки — абзац.
      const text = normalizeSpaces(inlineFromTiptap(node.content));
      if (text) {
        blocks.push(text);
      }
    }
  }

  return blocks.join("\n\n");
}

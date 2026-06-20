import Link from "next/link";
import { parseInline } from "../lib/legalMarkup";
import { safeHref } from "../lib/url";

type LegalDocumentProps = {
  body: string;
  tokens: Record<string, string>;
};

// Инлайн-разметка разбирается общим parseInline (ссылки, **жирный**, *курсив*) —
// те же правила, что в визуальном редакторе админки. Ссылки: внутренние через
// <Link>, внешние — через <a> c защитой safeHref. Текст рендерится как есть
// (React экранирует), поэтому HTML/скрипты из админки на страницу не попадают.
function renderInline(text: string, keyBase: string): React.ReactNode {
  const tokens = parseInline(text);
  if (tokens.length === 1 && tokens[0].kind === "text") {
    return tokens[0].text;
  }

  return tokens.map((token, i) => {
    const key = `${keyBase}-t${i}`;
    switch (token.kind) {
      case "link": {
        // Внутренняя ссылка — одиночный «/»: «//evil.com» и «/\evil.com» браузер
        // трактует как внешние протокол-относительные, поэтому им — safeHref.
        const isInternal = /^\/(?![/\\])/.test(token.href);
        return isInternal ? (
          <Link key={key} href={token.href}>
            {token.label}
          </Link>
        ) : (
          <a key={key} href={safeHref(token.href)} target="_blank" rel="noreferrer">
            {token.label}
          </a>
        );
      }
      case "strong":
        return <strong key={key}>{token.text}</strong>;
      case "em":
        return <em key={key}>{token.text}</em>;
      case "strongEm":
        return (
          <strong key={key}>
            <em>{token.text}</em>
          </strong>
        );
      default:
        return token.text;
    }
  });
}

// Рендерит текст юридического документа из админки ("Юр. документы").
// Разметка: "## " — раздел (h2), "### " — подраздел (h3), "- " — пункт списка,
// пустая строка — новый абзац. Токены {operator_name} и т.п. заменяются
// значениями из настроек до разбора; неизвестные токены остаются как есть.
export default function LegalDocument({ body, tokens }: LegalDocumentProps) {
  // Object.hasOwn отсекает унаследованные свойства: иначе {constructor} в
  // тексте отрендерил бы внутренности Object.prototype.
  const text = body.replace(/\{(\w+)\}/g, (whole, key: string) =>
    Object.hasOwn(tokens, key) ? tokens[key] : whole,
  );
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let paraLines: string[] = [];

  const flushPara = () => {
    if (!paraLines.length) {
      return;
    }
    const key = `b${blocks.length}`;
    blocks.push(<p key={key}>{renderInline(paraLines.join(" "), key)}</p>);
    paraLines = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }
    const key = `b${blocks.length}`;
    blocks.push(
      <ul key={key}>
        {listItems.map((item, j) => (
          <li key={j}>{renderInline(item, `${key}-i${j}`)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      const key = `b${blocks.length}`;
      blocks.push(<h2 key={key}>{renderInline(line.slice(3), key)}</h2>);
    } else if (line.startsWith("### ")) {
      flushPara();
      flushList();
      const key = `b${blocks.length}`;
      blocks.push(<h3 key={key}>{renderInline(line.slice(4), key)}</h3>);
    } else if (line.startsWith("- ")) {
      flushPara();
      listItems.push(line.slice(2));
    } else if (line === "-") {
      // Недописанный маркер пункта («- » без текста): игнорируем, не разрывая
      // текущий список и не превращая «-» в абзац.
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

  return <>{blocks}</>;
}

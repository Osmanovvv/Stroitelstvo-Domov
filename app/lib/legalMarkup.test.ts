import assert from "node:assert/strict";
import test from "node:test";
import { markupToHtml, tiptapJsonToMarkup, type TiptapNode } from "./legalMarkup";

test("заголовки, абзацы и списки конвертируются в HTML", () => {
  const html = markupToHtml("## Раздел\n\nАбзац текста.\n\n- пункт один;\n- пункт два.\n\n### Подраздел");
  assert.equal(
    html,
    "<h2>Раздел</h2><p>Абзац текста.</p><ul><li>пункт один;</li><li>пункт два.</li></ul><h3>Подраздел</h3>",
  );
});

test("ссылки рендерятся, HTML в тексте экранируется", () => {
  const html = markupToHtml("Текст со [ссылкой](/consent) и <script>alert(1)</script>.");
  assert.equal(
    html,
    '<p>Текст со <a href="/consent">ссылкой</a> и &lt;script&gt;alert(1)&lt;/script&gt;.</p>',
  );
});

test("многострочный абзац склеивается, CRLF нормализуется, пустой маркер игнорируется", () => {
  const html = markupToHtml("Первая строка\r\nвторая строка\r\n\r\n- a\r\n- \r\n- b");
  assert.equal(html, "<p>Первая строка вторая строка</p><ul><li>a</li><li>b</li></ul>");
});

test("пустое тело дает пустой HTML", () => {
  assert.equal(markupToHtml(""), "");
});

test("жирный, курсив и их сочетание конвертируются в HTML", () => {
  const html = markupToHtml("Обычный **жирный** и *курсив*, а еще ***оба сразу***.");
  assert.equal(
    html,
    "<p>Обычный <strong>жирный</strong> и <em>курсив</em>, а еще <strong><em>оба сразу</em></strong>.</p>",
  );
});

test("tiptap: жирный/курсив сериализуются, разбитые прогоны склеиваются", () => {
  const doc: TiptapNode = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: "До " },
          { type: "text", text: "жир", marks: [{ type: "bold" }] },
          { type: "text", text: "ный", marks: [{ type: "bold" }] },
          { type: "text", text: " и " },
          { type: "text", text: "оба", marks: [{ type: "bold" }, { type: "italic" }] },
          { type: "text", text: " после" },
        ],
      },
    ],
  };
  assert.equal(tiptapJsonToMarkup(doc), "До **жирный** и ***оба*** после");
});

test("круговая конвертация жирного текста без потерь", () => {
  const source = "Абзац с **жирным** словом.\n\n- пункт с *курсивом* внутри";
  const html = markupToHtml(source);
  assert.equal(
    html,
    "<p>Абзац с <strong>жирным</strong> словом.</p><ul><li>пункт с <em>курсивом</em> внутри</li></ul>",
  );
});

test("tiptap-документ сериализуется в формат хранения", () => {
  const doc: TiptapNode = {
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Раздел" }] },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Текст со " },
          { type: "text", text: "ссылкой", marks: [{ type: "link", attrs: { href: "/consent" } }] },
          { type: "text", text: "." },
        ],
      },
      {
        type: "bulletList",
        content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "пункт один;" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "пункт два." }] }] },
        ],
      },
      { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Подраздел" }] },
      { type: "paragraph" },
    ],
  };
  assert.equal(
    tiptapJsonToMarkup(doc),
    "## Раздел\n\nТекст со [ссылкой](/consent).\n\n- пункт один;\n- пункт два.\n\n### Подраздел",
  );
});

test("круговая конвертация: markup -> tiptap-подобный JSON -> markup без потерь", () => {
  // Имитирует структуру, которую TipTap построит из HTML markupToHtml:
  // соседние текстовые узлы с одинаковой link-меткой склеиваются.
  const doc: TiptapNode = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Начало " },
          { type: "text", text: "разби", marks: [{ type: "link", attrs: { href: "/privacy" } }] },
          { type: "text", text: "той", marks: [{ type: "link", attrs: { href: "/privacy" } }] },
          { type: "text", text: " конец" },
        ],
      },
    ],
  };
  assert.equal(tiptapJsonToMarkup(doc), "Начало [разбитой](/privacy) конец");
});

test("ссылка с непредставимым href (пробелы/скобки) сводится к тексту", () => {
  const doc: TiptapNode = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: "битая", marks: [{ type: "link", attrs: { href: "https://a (b)" } }] },
        ],
      },
    ],
  };
  assert.equal(tiptapJsonToMarkup(doc), "битая");
});

test("вложенный список разворачивается в плоские пункты, пустой документ — в пустую строку", () => {
  const doc: TiptapNode = {
    type: "doc",
    content: [
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              { type: "paragraph", content: [{ type: "text", text: "родитель" }] },
              {
                type: "bulletList",
                content: [
                  { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "вложенный" }] }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  assert.equal(tiptapJsonToMarkup(doc), "- родитель\n- вложенный");
  assert.equal(tiptapJsonToMarkup({ type: "doc", content: [{ type: "paragraph" }] }), "");
});

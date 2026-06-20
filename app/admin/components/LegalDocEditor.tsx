"use client";

import { useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link2, Link2Off, List, Redo2, Undo2 } from "lucide-react";
import { markupToHtml, tiptapJsonToMarkup } from "@/app/lib/legalMarkup";

type LegalDocEditorProps = {
  name: string;
  initialBody: string;
};

// Визуальный редактор юридических документов на TipTap (ProseMirror): заказчик
// правит текст как в Word — выпадающий список стилей, жирный/курсив (Ctrl+B /
// Ctrl+I), списки, ссылки, отмена. Скрытый input отдаёт серверному экшену
// документ уже сериализованным в формат хранения (tiptapJsonToMarkup).
export default function LegalDocEditor({ name, initialBody }: LegalDocEditorProps) {
  const [value, setValue] = useState(initialBody);
  // Счетчик перерисовок: тулбар отражает формат по положению курсора.
  const [, setSelectionTick] = useState(0);

  const editor = useEditor({
    // SSR Next.js: первый рендер без документа, монтирование только на клиенте.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: false },
        // Не поддерживается форматом хранения — отключено, чтобы не теряться
        // молча при сохранении.
        strike: false,
        underline: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        orderedList: false,
      }),
    ],
    content: markupToHtml(initialBody),
    editorProps: {
      attributes: { class: "admin-wysiwyg" },
    },
    onUpdate: ({ editor: current }) => setValue(tiptapJsonToMarkup(current.getJSON())),
    onSelectionUpdate: () => setSelectionTick((tick) => tick + 1),
  });

  function currentStyle(current: Editor): string {
    if (current.isActive("heading", { level: 2 })) return "h2";
    if (current.isActive("heading", { level: 3 })) return "h3";
    return "p";
  }

  function applyStyle(current: Editor, style: string) {
    const chain = current.chain().focus();
    if (style === "h2") {
      chain.setHeading({ level: 2 }).run();
    } else if (style === "h3") {
      chain.setHeading({ level: 3 }).run();
    } else {
      chain.setParagraph().run();
    }
  }

  function editLink(current: Editor) {
    const url = window.prompt(
      "Адрес ссылки: страница сайта (например, /consent) или внешний адрес (https://...)",
      current.getAttributes("link").href ?? "",
    );
    if (url === null) {
      return;
    }
    const trimmed = url.trim();
    if (!trimmed) {
      current.chain().focus().unsetLink().run();
      return;
    }
    current.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }

  return (
    <div className="admin-wysiwyg-shell">
      <div className="admin-wysiwyg-toolbar" role="toolbar" aria-label="Форматирование">
        {editor ? (
          <>
            <div className="admin-wysiwyg-group">
              <button
                type="button"
                title="Отменить (Ctrl+Z)"
                aria-label="Отменить"
                disabled={!editor.can().undo()}
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo2 size={17} />
              </button>
              <button
                type="button"
                title="Вернуть (Ctrl+Y)"
                aria-label="Вернуть"
                disabled={!editor.can().redo()}
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo2 size={17} />
              </button>
            </div>

            <div className="admin-wysiwyg-group">
              <select
                className="admin-wysiwyg-style"
                title="Стиль текста"
                aria-label="Стиль текста"
                value={currentStyle(editor)}
                onChange={(event) => applyStyle(editor, event.target.value)}
              >
                <option value="p">Обычный текст</option>
                <option value="h2">Заголовок</option>
                <option value="h3">Подзаголовок</option>
              </select>
            </div>

            <div className="admin-wysiwyg-group">
              <button
                type="button"
                title="Жирный (Ctrl+B)"
                aria-label="Жирный"
                className={editor.isActive("bold") ? "active" : undefined}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold size={17} />
              </button>
              <button
                type="button"
                title="Курсив (Ctrl+I)"
                aria-label="Курсив"
                className={editor.isActive("italic") ? "active" : undefined}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic size={17} />
              </button>
            </div>

            <div className="admin-wysiwyg-group">
              <button
                type="button"
                title="Маркированный список"
                aria-label="Список"
                className={editor.isActive("bulletList") ? "active" : undefined}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List size={17} />
              </button>
              <button
                type="button"
                title="Вставить или изменить ссылку"
                aria-label="Ссылка"
                className={editor.isActive("link") ? "active" : undefined}
                onClick={() => editLink(editor)}
              >
                <Link2 size={17} />
              </button>
              <button
                type="button"
                title="Убрать ссылку"
                aria-label="Убрать ссылку"
                disabled={!editor.isActive("link")}
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                <Link2Off size={17} />
              </button>
            </div>
          </>
        ) : null}
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

import { Fragment, type ReactNode } from "react";

// Рендерит строку, выделяя текст между **двумя звёздочками** акцентным цветом
// (.text-accent). Без dangerouslySetInnerHTML — безопасные React-узлы.
export function renderAccent(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span className="text-accent" key={i}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

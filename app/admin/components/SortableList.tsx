"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import Image from "next/image";

type Cell =
  | { kind: "image"; src: string | null }
  | { kind: "title"; value: string }
  | { kind: "text"; value: string };

export type SortableItem = {
  id: string;
  isVisible: boolean;
  editHref: string;
  cells: Cell[];
};

type SortableListProps = {
  headers: string[];
  items: SortableItem[];
  move: (id: string, direction: "up" | "down") => Promise<void>;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export default function SortableList({
  headers,
  items: initialItems,
  move,
  toggle,
  remove,
}: SortableListProps) {
  const [items, setItems] = useState(initialItems);

  function reorder(index: number, direction: "up" | "down") {
    const target = direction === "down" ? index + 1 : index - 1;
    if (target < 0 || target >= items.length) return;
    const movedId = items[index].id;

    const apply = () =>
      setItems((prev) => {
        const next = [...prev];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });

    // View Transitions плавно «довозят» строки на новые позиции.
    // flushSync гарантирует, что DOM обновится синхронно внутри перехода.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }

    void move(movedId, direction);
  }

  function onToggle(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isVisible: !it.isVisible } : it)),
    );
    void toggle(id);
  }

  function onRemove(id: string) {
    if (!confirm("Удалить запись? Действие необратимо.")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    void remove(id);
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id} style={{ viewTransitionName: `row-${item.id}` }}>
            {item.cells.map((cell, ci) => (
              <td key={ci}>
                {cell.kind === "image" ? (
                  cell.src && <Image src={cell.src} alt="" width={64} height={44} />
                ) : cell.kind === "title" ? (
                  <>
                    {cell.value}
                    {!item.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                  </>
                ) : (
                  cell.value
                )}
              </td>
            ))}
            <td>
              <div className="admin-row-actions">
                <Link className="admin-btn" href={item.editHref}>
                  Редактировать
                </Link>
                <button
                  className="admin-btn admin-move-btn"
                  type="button"
                  aria-label="Выше"
                  onClick={() => reorder(index, "up")}
                >
                  ↑
                </button>
                <button
                  className="admin-btn admin-move-btn"
                  type="button"
                  aria-label="Ниже"
                  onClick={() => reorder(index, "down")}
                >
                  ↓
                </button>
                <button className="admin-btn" type="button" onClick={() => onToggle(item.id)}>
                  {item.isVisible ? "Скрыть" : "Показать"}
                </button>
                <button className="admin-btn danger" type="button" onClick={() => onRemove(item.id)}>
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

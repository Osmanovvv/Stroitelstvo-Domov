"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";

export type ResourceRecord = {
  id: string;
  isVisible: boolean;
  image: string | null;
  values: Record<string, string>;
};

export type Column = {
  header: string;
  field: string;
  kind: "image" | "title" | "text";
};

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
  required?: boolean;
};

type ResourceManagerProps = {
  title: string;
  addLabel: string;
  hasImage: boolean;
  columns: Column[];
  fields: Field[];
  items: ResourceRecord[];
  create: (formData: FormData) => Promise<ResourceRecord>;
  update: (formData: FormData) => Promise<ResourceRecord>;
  remove: (id: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  move: (id: string, direction: "up" | "down") => Promise<void>;
};

export default function ResourceManager({
  title,
  addLabel,
  hasImage,
  columns,
  fields,
  items: initialItems,
  create,
  update,
  remove,
  toggle,
  move,
}: ResourceManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<ResourceRecord | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function revert(snapshot: ResourceRecord[]) {
    setItems(snapshot);
    alert("Не удалось сохранить изменение. Обновите страницу и попробуйте снова.");
  }

  useEffect(() => {
    if (editing !== null) {
      setError(null);
      dialogRef.current?.showModal();
    }
  }, [editing]);

  function closeModal() {
    dialogRef.current?.close();
  }

  async function reorder(index: number, direction: "up" | "down") {
    if (busy) return; // сериализуем перестановки, чтобы не было гонок по sortOrder
    const target = direction === "down" ? index + 1 : index - 1;
    if (target < 0 || target >= items.length) return;
    const movedId = items[index].id;
    const snapshot = items;
    const apply = () =>
      setItems((prev) => {
        const next = [...prev];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }

    setBusy(true);
    try {
      await move(movedId, direction);
    } catch {
      revert(snapshot);
    } finally {
      setBusy(false);
    }
  }

  async function onToggle(id: string) {
    const snapshot = items;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, isVisible: !it.isVisible } : it)));
    try {
      await toggle(id);
    } catch {
      revert(snapshot);
    }
  }

  async function onRemove(id: string) {
    if (!confirm("Удалить запись? Действие необратимо.")) return;
    const snapshot = items;
    setItems((prev) => prev.filter((it) => it.id !== id));
    try {
      await remove(id);
    } catch {
      revert(snapshot);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSaving(true);
    setError(null);
    try {
      const saved = editing === "new" ? await create(formData) : await update(formData);
      setItems((prev) =>
        editing === "new" ? [...prev, saved] : prev.map((it) => (it.id === saved.id ? saved : it)),
      );
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  const current = editing === "new" || editing === null ? null : editing;

  return (
    <>
      <div className="admin-topbar">
        <h2>{title}</h2>
        <button className="admin-btn primary" type="button" onClick={() => setEditing("new")}>
          {addLabel}
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.field}>{c.header}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{ viewTransitionName: `row-${item.id}` }}>
                {columns.map((c) => (
                  <td key={c.field}>
                    {c.kind === "image" ? (
                      item.image && <Image src={item.image} alt="" width={64} height={44} />
                    ) : c.kind === "title" ? (
                      <>
                        {item.values[c.field]}
                        {!item.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                      </>
                    ) : (
                      item.values[c.field]
                    )}
                  </td>
                ))}
                <td>
                  <div className="admin-row-actions">
                    <button className="admin-btn" type="button" onClick={() => setEditing(item)}>
                      Редактировать
                    </button>
                    <button
                      className="admin-btn admin-move-btn"
                      type="button"
                      aria-label="Выше"
                      disabled={busy}
                      onClick={() => reorder(index, "up")}
                    >
                      ↑
                    </button>
                    <button
                      className="admin-btn admin-move-btn"
                      type="button"
                      aria-label="Ниже"
                      disabled={busy}
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
      </div>

      <dialog
        ref={dialogRef}
        className="admin-modal"
        aria-labelledby="admin-modal-title"
        onClose={() => setEditing(null)}
        onClick={(e) => {
          if (saving) return;
          if (e.target === dialogRef.current) closeModal();
        }}
      >
        {editing !== null && (
          <form
            key={editing === "new" ? "new" : editing.id}
            className="admin-modal-inner admin-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-modal-head">
              <h3 id="admin-modal-title">{editing === "new" ? `${addLabel}` : "Редактирование"}</h3>
              <button
                type="button"
                className="admin-modal-close"
                aria-label="Закрыть"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {current && <input type="hidden" name="id" value={current.id} />}

            {fields.map((f, idx) => (
              <div className="admin-field" key={f.name}>
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    defaultValue={current?.values[f.name] ?? ""}
                    placeholder={f.placeholder}
                    required={f.required}
                    autoFocus={idx === 0}
                  />
                ) : (
                  <input
                    name={f.name}
                    defaultValue={current?.values[f.name] ?? ""}
                    placeholder={f.placeholder}
                    required={f.required}
                    autoFocus={idx === 0}
                  />
                )}
              </div>
            ))}

            {hasImage && (
              <div className="admin-field">
                <label>Фото</label>
                <input type="hidden" name="imageExisting" value={current?.image ?? ""} />
                {current?.image && (
                  <Image className="admin-preview" src={current.image} alt="" width={160} height={110} />
                )}
                <input name="imageFile" type="file" accept="image/*" />
              </div>
            )}

            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}

            <div className="admin-form-actions">
              <button className="admin-btn primary" type="submit" disabled={saving}>
                {saving ? "Сохранение…" : "Сохранить"}
              </button>
              <button className="admin-btn" type="button" onClick={closeModal}>
                Отмена
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}

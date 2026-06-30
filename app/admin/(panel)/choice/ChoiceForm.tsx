"use client";

import { useState } from "react";
import { toast } from "@/app/admin/components/Toast";
import { updateChoice } from "./actions";

type Card = { title: string; text: string };

export default function ChoiceForm({ cards }: { cards: Card[] }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSaving(true);
    setError(null);
    try {
      const result = await updateChoice(new FormData(formEl));
      if ("error" in result) {
        setError(result.error);
        return;
      }
      toast("Сохранено");
    } catch {
      setError("Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {cards.map((c, i) => (
        <div className="admin-field" key={i}>
          <label>Карточка {i + 1}</label>
          <input
            name={`choice_${i + 1}_title`}
            defaultValue={c.title}
            placeholder="Заголовок"
          />
          <input
            name={`choice_${i + 1}_text`}
            defaultValue={c.text}
            placeholder="Подпись"
            style={{ marginTop: 8 }}
          />
        </div>
      ))}
      <small style={{ color: "#8a93a6", fontSize: 12 }}>
        Меняется только текст карточек. Иконка и ссылка на раздел остаются. Пустое
        поле = текст по умолчанию.
      </small>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button className="admin-btn primary" type="submit" disabled={saving}>
        {saving ? "Сохранение…" : "Сохранить"}
      </button>
    </form>
  );
}

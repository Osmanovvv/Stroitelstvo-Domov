"use client";

import { useState } from "react";
import Image from "next/image";
import { compressImage } from "@/app/admin/components/compressImage";
import { toast } from "@/app/admin/components/Toast";
import { updateCalc } from "./actions";

type QuizImageField = {
  label: string;
  field: string;
  existing: string;
  preview: string;
};

type Props = {
  quizImages: QuizImageField[];
};

export default function CalcForm(p: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData(formEl);
      // Сжимаем каждый выбранный файл в браузере перед отправкой.
      for (const el of Array.from(formEl.querySelectorAll('input[type="file"]'))) {
        const input = el as HTMLInputElement;
        const f = input.files?.[0];
        if (f && f.size > 0) {
          formData.set(input.name, await compressImage(f));
        }
      }
      const result = await updateCalc(formData);
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
      <div className="admin-field">
        <label>Фото вариантов квиза — Шаг 1 «Какой вариант рассматриваете?»</label>
        <small style={{ color: "#8a93a6", fontSize: 12 }}>
          Показываются в квизе на первом экране. Пусто = фото-заглушки по умолчанию.
        </small>
        <div style={{ display: "grid", gap: 18, marginTop: 12 }}>
          {p.quizImages.map((q) => (
            <div key={q.field} style={{ display: "grid", gap: 6 }}>
              <strong style={{ fontSize: 13 }}>{q.label}</strong>
              <input type="hidden" name={`${q.field}Existing`} value={q.existing} />
              {q.preview && (
                <Image className="admin-hero-preview" src={q.preview} alt="" width={220} height={132} />
              )}
              <input name={`${q.field}File`} type="file" accept="image/*" />
              {q.existing && (
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 400 }}>
                  <input type="checkbox" name={`${q.field}Remove`} /> Вернуть фото по умолчанию
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
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

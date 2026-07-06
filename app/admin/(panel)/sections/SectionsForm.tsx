"use client";

import { useState } from "react";
import Image from "next/image";
import { compressImage } from "@/app/admin/components/compressImage";
import { toast } from "@/app/admin/components/Toast";
import { updateSections } from "./actions";

type SectionData = {
  id: string;
  label: string;
  bg: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  bgExisting: string;
};

export default function SectionsForm({ sections }: { sections: SectionData[] }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData(formEl);
      // Сжимаем каждый выбранный файл-фон в браузере перед отправкой.
      for (const el of Array.from(formEl.querySelectorAll('input[type="file"]'))) {
        const input = el as HTMLInputElement;
        const f = input.files?.[0];
        if (f && f.size > 0) {
          formData.set(input.name, await compressImage(f));
        }
      }
      const result = await updateSections(formData);
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
      {sections.map((sec) => (
        <div
          key={sec.id}
          style={{ borderTop: "1px solid #e5e8f0", paddingTop: 18, marginTop: 6 }}
        >
          <strong style={{ display: "block", fontSize: 15, marginBottom: 10 }}>{sec.label}</strong>
          <div className="admin-field">
            <label>Надзаголовок</label>
            <input name={`${sec.id}_eyebrow`} defaultValue={sec.eyebrow} />
          </div>
          <div className="admin-field">
            <label>Заголовок</label>
            <input name={`${sec.id}_title`} defaultValue={sec.title} />
            <small style={{ color: "#8a93a6", fontSize: 12 }}>
              Текст между **двумя звёздочками** выделяется цветом.
            </small>
          </div>
          <div className="admin-field">
            <label>Подпись</label>
            <textarea name={`${sec.id}_subtitle`} rows={2} defaultValue={sec.subtitle} />
          </div>
          {sec.bg && (
            <div className="admin-field">
              <label>Фон секции (фото)</label>
              <input type="hidden" name={`${sec.id}_bgExisting`} value={sec.bgExisting} />
              {sec.bgExisting && (
                <Image className="admin-hero-preview" src={sec.bgExisting} alt="" width={320} height={150} />
              )}
              <input name={`${sec.id}_bgFile`} type="file" accept="image/*" />
              <small style={{ color: "#8a93a6", fontSize: 12 }}>
                Поверх фото — затемнение, текст станет светлым. Пусто = стандартный цвет секции.
              </small>
              {sec.bgExisting && (
                <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, fontWeight: 400 }}>
                  <input type="checkbox" name={`${sec.id}_bgRemove`} /> Убрать фон (вернуть цвет)
                </label>
              )}
            </div>
          )}
        </div>
      ))}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button className="admin-btn primary" type="submit" disabled={saving} style={{ marginTop: 18 }}>
        {saving ? "Сохранение…" : "Сохранить"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { toast } from "@/app/admin/components/Toast";
import { updateCompare } from "./actions";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  houseTitle: string;
  houseFeatures: string;
  housePrice: string;
  flatTitle: string;
  flatFeatures: string;
  flatPrice: string;
};

export default function CompareForm(p: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSaving(true);
    setError(null);
    try {
      const result = await updateCompare(new FormData(formEl));
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
        <label>Надзаголовок</label>
        <input name="compare_eyebrow" defaultValue={p.eyebrow} />
      </div>
      <div className="admin-field">
        <label>Заголовок</label>
        <input name="compare_title" defaultValue={p.title} />
        <small style={{ color: "#8a93a6", fontSize: 12 }}>
          Текст между **двумя звёздочками** выделяется цветом.
        </small>
      </div>
      <div className="admin-field">
        <label>Подпись</label>
        <textarea name="compare_subtitle" rows={2} defaultValue={p.subtitle} />
      </div>

      <div className="admin-field">
        <label>Колонка «Дом» — заголовок</label>
        <input name="compare_house_title" defaultValue={p.houseTitle} />
      </div>
      <div className="admin-field">
        <label>Колонка «Дом» — пункты (по одному на строку)</label>
        <textarea name="compare_house_features" rows={3} defaultValue={p.houseFeatures} />
      </div>
      <div className="admin-field">
        <label>Колонка «Дом» — цена</label>
        <input name="compare_house_price" defaultValue={p.housePrice} />
      </div>

      <div className="admin-field">
        <label>Колонка «Квартира» — заголовок</label>
        <input name="compare_flat_title" defaultValue={p.flatTitle} />
      </div>
      <div className="admin-field">
        <label>Колонка «Квартира» — пункты (по одному на строку)</label>
        <textarea name="compare_flat_features" rows={3} defaultValue={p.flatFeatures} />
      </div>
      <div className="admin-field">
        <label>Колонка «Квартира» — цена</label>
        <input name="compare_flat_price" defaultValue={p.flatPrice} />
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

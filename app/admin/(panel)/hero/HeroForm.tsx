"use client";

import { useState } from "react";
import Image from "next/image";
import { compressImage } from "@/app/admin/components/compressImage";
import { toast } from "@/app/admin/components/Toast";
import { updateHero } from "./actions";

type HeroFormProps = {
  title: string;
  subtitle: string;
  image: string;
  badge1: string;
  badge2: string;
  badge3: string;
};

export default function HeroForm({ title, subtitle, image, badge1, badge2, badge3 }: HeroFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData(formEl);
      const input = formEl.querySelector(
        'input[name="heroImageFile"]',
      ) as HTMLInputElement | null;
      const file = input?.files?.[0];
      if (file && file.size > 0) {
        formData.set("heroImageFile", await compressImage(file));
      }
      const result = await updateHero(formData);
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
      <input type="hidden" name="heroImageExisting" value={image} />
      <div className="admin-field">
        <label>Заголовок</label>
        <textarea name="hero_title" rows={3} defaultValue={title} />
        <small style={{ color: "#8a93a6", fontSize: 12 }}>
          Каждая строка заголовка — с новой строки (Enter). Размер подстраивается под экран автоматически.
          Текст между **двумя звёздочками** выделяется цветом, например: Кирпичные дома **в Краснодаре**.
        </small>
      </div>
      <div className="admin-field">
        <label>Подзаголовок</label>
        <input name="hero_subtitle" defaultValue={subtitle} />
      </div>
      <div className="admin-field">
        <label>Бейджи-преимущества (под подзаголовком)</label>
        <input name="hero_badge_1" defaultValue={badge1} placeholder="Договор и смета" />
        <input name="hero_badge_2" defaultValue={badge2} placeholder="Объекты можно посмотреть" style={{ marginTop: 8 }} />
        <input name="hero_badge_3" defaultValue={badge3} placeholder="Ипотека Сбер, ВТБ, Альфа" style={{ marginTop: 8 }} />
        <small style={{ color: "#8a93a6", fontSize: 12 }}>
          Три коротких преимущества. Меняется только текст — иконки остаются на своих местах.
          Пустое поле = текст по умолчанию.
        </small>
      </div>
      <div className="admin-field">
        <label>Фото главного экрана</label>
        <Image className="admin-hero-preview" src={image} alt="" width={320} height={170} />
        <input name="heroImageFile" type="file" accept="image/*" />
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

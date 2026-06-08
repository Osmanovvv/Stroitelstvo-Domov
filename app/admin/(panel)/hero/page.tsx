import Image from "next/image";
import { getSettings } from "@/app/lib/queries";
import { heroDefaults } from "@/app/content/landing";
import { updateHero } from "./actions";

export const dynamic = "force-dynamic";

export default async function HeroAdmin() {
  const s = await getSettings();
  const image = s.hero_image || heroDefaults.image;

  return (
    <>
      <div className="admin-topbar"><h2>Главный экран</h2></div>
      <div className="admin-card">
        <form className="admin-form" action={updateHero}>
          <input type="hidden" name="heroImageExisting" value={image} />
          <div className="admin-field">
            <label>Заголовок</label>
            <textarea name="hero_title" rows={3} defaultValue={s.hero_title ?? heroDefaults.title} />
            <small style={{ color: "#8a93a6", fontSize: 12 }}>
              Каждая строка заголовка — с новой строки (Enter). Размер подстраивается под экран автоматически.
            </small>
          </div>
          <div className="admin-field">
            <label>Подзаголовок</label>
            <input name="hero_subtitle" defaultValue={s.hero_subtitle ?? heroDefaults.subtitle} />
          </div>
          <div className="admin-field">
            <label>Фото главного экрана</label>
            <Image className="admin-hero-preview" src={image} alt="" width={320} height={170} />
            <input name="heroImageFile" type="file" accept="image/*" />
          </div>
          <button className="admin-btn primary" type="submit">Сохранить</button>
        </form>
      </div>
    </>
  );
}

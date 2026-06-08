import Image from "next/image";
import { prisma } from "@/app/lib/db";
import { heroDefaults } from "@/app/content/landing";
import { updateHero } from "./actions";

export const dynamic = "force-dynamic";

export default async function HeroAdmin() {
  const rows = await prisma.siteSetting.findMany();
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const image = s.hero_image || heroDefaults.image;

  return (
    <>
      <div className="admin-topbar"><h2>Главный экран</h2></div>
      <div className="admin-card">
        <form className="admin-form" action={updateHero}>
          <input type="hidden" name="heroImageExisting" value={image} />
          <div className="admin-field">
            <label>Заголовок</label>
            <input name="hero_title" defaultValue={s.hero_title ?? heroDefaults.title} />
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

import { getSettings } from "@/app/lib/queries";
import { heroDefaults } from "@/app/content/landing";
import HeroForm from "./HeroForm";

export const dynamic = "force-dynamic";

export default async function HeroAdmin() {
  const s = await getSettings();

  return (
    <>
      <div className="admin-topbar">
        <h2>Главный экран</h2>
      </div>
      <div className="admin-card">
        <HeroForm
          title={s.hero_title ?? heroDefaults.title}
          subtitle={s.hero_subtitle ?? heroDefaults.subtitle}
          image={s.hero_image || heroDefaults.image}
        />
      </div>
    </>
  );
}

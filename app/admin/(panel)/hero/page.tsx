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
          badge1={s.hero_badge_1 ?? heroDefaults.badges[0]}
          badge2={s.hero_badge_2 ?? heroDefaults.badges[1]}
          badge3={s.hero_badge_3 ?? heroDefaults.badges[2]}
        />
      </div>
    </>
  );
}

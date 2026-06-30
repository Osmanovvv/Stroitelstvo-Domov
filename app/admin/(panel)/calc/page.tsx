import { getSettings } from "@/app/lib/queries";
import { calcDefaults } from "@/app/content/landing";
import CalcForm from "./CalcForm";

export const dynamic = "force-dynamic";

export default async function CalcAdmin() {
  const s = await getSettings();
  const d = calcDefaults;

  return (
    <>
      <div className="admin-topbar">
        <h2>Подбор и расчёт</h2>
      </div>
      <div className="admin-card">
        <CalcForm
          eyebrow={s.calc_eyebrow ?? d.eyebrow}
          title={s.calc_title ?? d.title}
          subtitle={s.calc_subtitle ?? d.subtitle}
          bgImage={s.calc_bg_image ?? ""}
        />
      </div>
    </>
  );
}

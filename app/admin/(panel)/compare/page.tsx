import { getSettings } from "@/app/lib/queries";
import { compareDefaults } from "@/app/content/landing";
import CompareForm from "./CompareForm";

export const dynamic = "force-dynamic";

export default async function CompareAdmin() {
  const s = await getSettings();
  const d = compareDefaults;

  return (
    <>
      <div className="admin-topbar">
        <h2>Дом или квартира</h2>
      </div>
      <div className="admin-card">
        <CompareForm
          eyebrow={s.compare_eyebrow ?? d.eyebrow}
          title={s.compare_title ?? d.title}
          subtitle={s.compare_subtitle ?? d.subtitle}
          houseTitle={s.compare_house_title ?? d.houseTitle}
          houseFeatures={s.compare_house_features ?? d.houseFeatures.join("\n")}
          housePrice={s.compare_house_price ?? d.housePrice}
          flatTitle={s.compare_flat_title ?? d.flatTitle}
          flatFeatures={s.compare_flat_features ?? d.flatFeatures.join("\n")}
          flatPrice={s.compare_flat_price ?? d.flatPrice}
        />
      </div>
    </>
  );
}

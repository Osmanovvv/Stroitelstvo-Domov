import { getSettings } from "@/app/lib/queries";
import { mortgageFeatures } from "@/app/content/landing";
import MortgageForm from "./MortgageForm";

export const dynamic = "force-dynamic";

export default async function MortgageAdmin() {
  const s = await getSettings();
  const cards = mortgageFeatures.map((item, i) => ({
    title: s[`payment_f${i + 1}_title`] ?? item.title,
    text: s[`payment_f${i + 1}_text`] ?? item.text,
  }));

  return (
    <>
      <div className="admin-topbar">
        <h2>Блок «Ипотека» — карточки</h2>
      </div>
      <div className="admin-card">
        <MortgageForm cards={cards} />
      </div>
    </>
  );
}

import { getSettings } from "@/app/lib/queries";
import { choiceItems } from "@/app/content/landing";
import ChoiceForm from "./ChoiceForm";

export const dynamic = "force-dynamic";

export default async function ChoiceAdmin() {
  const s = await getSettings();
  const cards = choiceItems.map((item, i) => ({
    title: s[`choice_${i + 1}_title`] ?? item.title,
    text: s[`choice_${i + 1}_text`] ?? item.text,
  }));

  return (
    <>
      <div className="admin-topbar">
        <h2>Блок выбора</h2>
      </div>
      <div className="admin-card">
        <ChoiceForm cards={cards} />
      </div>
    </>
  );
}

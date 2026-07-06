import { getSettings } from "@/app/lib/queries";
import { sectionIntros } from "@/app/content/landing";
import { SECTION_FIELDS } from "./config";
import SectionsForm from "./SectionsForm";

export const dynamic = "force-dynamic";

export default async function SectionsAdmin() {
  const s = await getSettings();

  const sections = SECTION_FIELDS.map((f) => {
    const d = sectionIntros[f.id];
    return {
      id: f.id,
      label: f.label,
      bg: f.bg,
      // Показываем текущее значение (переопределение или дефолт), как в остальных формах.
      eyebrow: s[`${f.id}_eyebrow`] || d.eyebrow,
      title: s[`${f.id}_title`] || d.title,
      subtitle: s[`${f.id}_subtitle`] || d.subtitle || "",
      bgExisting: s[`${f.id}_bg_image`] ?? "",
    };
  });

  return (
    <>
      <div className="admin-topbar">
        <h2>Заголовки и фоны секций</h2>
      </div>
      <div className="admin-card">
        <SectionsForm sections={sections} />
      </div>
    </>
  );
}

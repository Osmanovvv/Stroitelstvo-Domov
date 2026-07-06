import { sectionIntros } from "../content/landing";
import { getSettings } from "../lib/queries";
import { renderAccent } from "../lib/accent";

// Общий редактируемый заголовок секции (надзаголовок/заголовок/подпись).
// Тексты берутся из настроек (<id>_eyebrow/_title/_subtitle) с откатом на
// дефолты из sectionIntros. В заголовке поддержан **акцент**. Используется
// секциями со стандартной «шапкой» .section-head (Проекты/Цены/Дома/… /Отзывы).
type Props = {
  id: string;
  // Доп. классы на .section-head (например "left" для лево-выровненной шапки).
  className?: string;
};

export default async function SectionHead({ id, className }: Props) {
  const s = await getSettings();
  const d = sectionIntros[id];
  const eyebrow = s[`${id}_eyebrow`] || d.eyebrow;
  const title = s[`${id}_title`] || d.title;
  const subtitle = s[`${id}_subtitle`] || d.subtitle || "";

  return (
    <div className={`container section-head${className ? ` ${className}` : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{renderAccent(title)}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

import { choiceItems } from "../../content/landing";
import { getSettings } from "../../lib/queries";

export default async function ChoiceSection() {
  // Текст карточек редактируется в админке (ключи choice_<n>_title / _text);
  // иконка и ссылка на раздел фиксированы. Пусто = дефолт из choiceItems.
  const settings = await getSettings();

  return (
    <section className="section choice-section">
      <div className="container choice-grid">
        {choiceItems.map((item, i) => {
          const Icon = item.icon;
          const title = settings[`choice_${i + 1}_title`] || item.title;
          const text = settings[`choice_${i + 1}_text`] || item.text;

          return (
            <a className="choice-item" href={item.href} key={item.href}>
              <span className="choice-icon">
                <Icon />
              </span>
              <span className="choice-copy">
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

import { processSteps, trustItems, sectionIntros } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import { sectionBgStyle } from "../../lib/sectionBg";
import SectionHead from "../SectionHead";

export default async function ProcessSection() {
  const s = await getSettings();
  const bg = s.process_bg_image;
  // Гарантии перенесены из бывшего блока «Доверие» (правка заказчика): показываем
  // их строкой карточек под шагами. Заголовок/подпись — ранее сохранённый текст
  // «Доверия» или дефолт; сами карточки-гарантии заданы в коде (trustItems).
  const guaranteeTitle = s.trust_title || sectionIntros.trust.title;
  const guaranteeSubtitle = s.trust_subtitle || sectionIntros.trust.subtitle;
  return (
    <section
      className={`section process-section${bg ? " has-bg" : ""}`}
      id="process"
      style={sectionBgStyle(bg)}
    >
      <SectionHead id="process" />
      <div className="container steps">
        {processSteps.map((step) => {
          const Icon = step.icon;

          return (
            <article className="step" key={step.number}>
              <Icon />
              <span className="step-num" aria-hidden="true">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          );
        })}
      </div>
      <div className="container process-guarantees">
        <div className="process-guarantees-head">
          <h3>{guaranteeTitle}</h3>
          <p>{guaranteeSubtitle}</p>
        </div>
        <div className="trust-grid">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <article className="trust-item" key={item.title}>
                <span className="trust-icon">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

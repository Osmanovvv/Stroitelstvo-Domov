import { processSteps } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import { sectionBgStyle } from "../../lib/sectionBg";
import SectionHead from "../SectionHead";

export default async function ProcessSection() {
  const s = await getSettings();
  const bg = s.process_bg_image;
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
    </section>
  );
}

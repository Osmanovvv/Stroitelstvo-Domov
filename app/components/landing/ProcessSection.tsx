import { processSteps } from "../../content/landing";

export default function ProcessSection() {
  return (
    <section className="section process-section" id="process">
      <div className="container section-head">
        <span className="eyebrow">Как мы работаем</span>
        <h2>Этапы строительства — от проекта до сдачи</h2>
      </div>
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

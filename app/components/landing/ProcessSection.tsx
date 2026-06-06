import { processSteps } from "../../content/landing";

export default function ProcessSection() {
  return (
    <section className="section process-section">
      <div className="container process-layout">
        <div className="section-head left">
          <span className="eyebrow">Этапы</span>
          <h2>Путь от заявки до дома</h2>
        </div>
        <div className="steps">
          {processSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article className="step" key={step.number}>
                <span>{step.number}</span>
                <Icon />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

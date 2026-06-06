import { trustItems } from "../../content/landing";

export default function TrustSection() {
  return (
    <section className="section trust-section">
      <div className="container section-head">
        <span className="eyebrow">Доверие</span>
        <h2>Доверие строится на прозрачности</h2>
        <p>До сделки вы видите объекты, смету, договор, этапы работ и условия оплаты.</p>
      </div>
      <div className="container trust-grid">
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
    </section>
  );
}

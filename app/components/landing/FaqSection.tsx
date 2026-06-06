import { faqItems } from "../../content/landing";

export default function FaqSection() {
  return (
    <section className="section faq-section">
      <div className="container two-column">
        <div className="section-head left">
          <span className="eyebrow">Вопросы</span>
          <h2>Ответы на частые вопросы</h2>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { choiceItems } from "../../content/landing";

export default function ChoiceSection() {
  return (
    <section className="section choice-section">
      <div className="container choice-grid">
        {choiceItems.map((item) => {
          const Icon = item.icon;

          return (
            <a className="choice-item" href={item.href} key={item.title}>
              <span className="choice-icon">
                <Icon />
              </span>
              <span className="choice-copy">
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

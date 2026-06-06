import { ArrowRight } from "lucide-react";
import { contactLinks } from "../../content/landing";
import ContactIcon from "../ContactIcon";
import WorkStatus from "../WorkStatus";

export default function ContactsSection() {
  return (
    <section className="section contacts-section" id="contacts">
      <div className="container contacts-layout">
        <div>
          <span className="eyebrow">Контакты</span>
          <h2>Подберем дом, проект или участок под ваш бюджет</h2>
          <p>Оставьте телефон, и мы предложим ближайший вариант для просмотра или расчета.</p>
          <div className="contact-status-card">
            <WorkStatus showHours />
          </div>
          <div className="contact-actions">
            {contactLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <ContactIcon link={link} size={18} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <form className="lead-form">
          <label>
            Имя
            <input type="text" placeholder="Как к вам обращаться" />
          </label>
          <label>
            Телефон
            <input type="tel" placeholder="+7 ___ ___-__-__" />
          </label>
          <label>
            Интересует
            <select defaultValue="ready-house">
              <option value="ready-house">Готовый дом</option>
              <option value="construction">Дом в строительстве</option>
              <option value="custom">Строительство под заказ</option>
              <option value="plot">Участок</option>
            </select>
          </label>
          <button className="button primary" type="button">
            Оставить заявку
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}

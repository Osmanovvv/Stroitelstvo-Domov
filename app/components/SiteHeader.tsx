import Image from "next/image";
import {
  contactLinks,
  mobileNavigationLinks,
  navigationLinks,
} from "../content/landing";
import ContactIcon from "./ContactIcon";
import WorkStatus from "./WorkStatus";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="На главный экран">
        <span className="brand-logo-shell" aria-hidden="true">
          <Image
            className="brand-logo"
            src="/logo/svm-logo-mark-cutout.png"
            alt=""
            width={96}
            height={96}
            priority
          />
        </span>
        <span>
          <strong>Кирпичные дома</strong>
          <small>Краснодар +70 км</small>
        </span>
      </a>

      <div className="header-proof" aria-label="Ключевая информация">
        <span className="header-claim" aria-label="Готовые дома. Строительство под заказ">
          <span>Готовые дома</span>
          <span>Строительство под заказ</span>
        </span>
      </div>

      <nav className="top-nav" aria-label="Основная навигация">
        {navigationLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <WorkStatus />
        <div className="header-contact-buttons" aria-label="Быстрая связь">
          {contactLinks.map((link) => (
            <a
              className="header-contact-link"
              href={link.href}
              key={link.label}
              aria-label={link.label}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              <ContactIcon link={link} size={18} />
            </a>
          ))}
        </div>
        <a className="header-callback" href="#contacts">
          Обсудить проект
        </a>
      </div>

      <details className="mobile-menu">
        <summary aria-label="Открыть меню">
          <span />
          <span />
          <span />
        </summary>
        <nav className="mobile-menu-panel" aria-label="Мобильная навигация">
          {mobileNavigationLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <span className="mobile-work-status">
            <WorkStatus showHours />
          </span>
          {contactLinks.map((link) => (
            <a
              className="mobile-menu-phone"
              href={link.href}
              key={link.label}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              <ContactIcon link={link} size={16} />
              {link.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}

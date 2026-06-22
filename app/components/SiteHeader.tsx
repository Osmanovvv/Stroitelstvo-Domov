import Image from "next/image";
import { ArrowRight, Phone, PhoneCall } from "lucide-react";
import {
  buildContactLinks,
  mobileNavigationLinks,
  navigationLinks,
} from "../content/landing";
import { getSettings } from "../lib/queries";
import ContactIcon from "./ContactIcon";
import WorkStatus from "./WorkStatus";

export default async function SiteHeader() {
  const settings = await getSettings();
  const contactLinks = buildContactLinks(settings);
  const messengers = contactLinks.filter(
    (link) => link.label === "MAX" || link.label === "Telegram",
  );
  const phone = settings.phone ?? "";
  const hours =
    settings.work_start && settings.work_end
      ? `${settings.work_start}–${settings.work_end}`
      : "8:00–19:00";

  return (
    <header className="site-header">
      <div className="header-top">
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
          <span className="brand-text">
            <strong>Строим вашу мечту</strong>
            <small>Кирпичные дома · Краснодар +70 км · с 2016 г.</small>
          </span>
        </a>

        <div className="header-cta">
          <a className="header-estimate" href="#contacts">
            Отправить проект на расчёт
            <ArrowRight size={17} />
          </a>
          <div className="header-messengers">
            <span className="header-online">Пишите, мы онлайн</span>
            <div className="header-messenger-icons" aria-label="Написать в мессенджер">
              {messengers.map((link) => (
                <a
                  className="header-contact-link"
                  href={link.href}
                  key={link.label}
                  aria-label={link.label}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  <ContactIcon link={link} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="header-phone-block">
          <span className="header-hours">Без выходных: {hours}</span>
          {phone && (
            <a className="header-phone" href={`tel:${phone}`}>
              <Phone size={22} strokeWidth={2.4} />
              {phone}
            </a>
          )}
          <a className="header-callback" href="#contacts">
            <PhoneCall size={14} />
            Заказать звонок
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
              <WorkStatus showHours workStart={settings.work_start} workEnd={settings.work_end} />
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
      </div>

      <nav className="header-nav" aria-label="Основная навигация">
        {navigationLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

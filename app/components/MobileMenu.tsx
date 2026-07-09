"use client";

import { useEffect, useRef, useState } from "react";
import { buildContactLinks, mobileNavigationLinks } from "../content/landing";
import ContactIcon from "./ContactIcon";
import WorkStatus from "./WorkStatus";

// Мобильное меню на явном JS-переключателе (useState + onClick), а НЕ на нативном
// <details>/<summary>: на части Android-браузеров нативное открытие не срабатывало
// («кнопка меню не реагирует»). Кнопка-гамбургер гарантированно работает везде.
export default function MobileMenu({ settings }: { settings: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const contactLinks = buildContactLinks(settings);

  // Закрытие по Esc и по клику вне меню.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [open]);

  return (
    <div className={`mobile-menu${open ? " open" : ""}`} ref={ref}>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mobile-menu-burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <nav className="mobile-menu-panel" aria-label="Мобильная навигация">
          {mobileNavigationLinks.map((link) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
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
              onClick={() => setOpen(false)}
            >
              <ContactIcon link={link} size={16} />
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

// Кнопка, открывающая всплывающую форму заявки (LeadModal) глобальным событием.
// Можно ставить в любую серверную секцию: className задаёт вид (button primary /
// text-link и т.п.), title — заголовок в попапе, withFile — показать ли поле
// прикрепления файла (для кнопки «Отправить проект на расчёт»).
type LeadModalTriggerProps = {
  className?: string;
  title?: string;
  withFile?: boolean;
  children: ReactNode;
};

export default function LeadModalTrigger({ className, title, withFile, children }: LeadModalTriggerProps) {
  function open() {
    window.dispatchEvent(new CustomEvent("open-lead-modal", { detail: { title, withFile } }));
  }

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}

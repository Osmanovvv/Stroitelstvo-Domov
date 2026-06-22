"use client";

import type { ReactNode } from "react";

// Кнопка, открывающая всплывающую форму заявки (LeadModal) глобальным событием.
// Можно ставить в любую серверную секцию: className задаёт вид (button primary /
// text-link и т.п.), title — заголовок, который покажется в попапе.
type LeadModalTriggerProps = {
  className?: string;
  title?: string;
  children: ReactNode;
};

export default function LeadModalTrigger({ className, title, children }: LeadModalTriggerProps) {
  function open() {
    window.dispatchEvent(new CustomEvent("open-lead-modal", { detail: { title } }));
  }

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}

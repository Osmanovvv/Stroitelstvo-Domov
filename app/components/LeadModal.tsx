"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import ConsentField from "./ConsentField";

// Всплывающая форма заявки. Открывается из любой кнопки на странице через
// глобальное событие "open-lead-modal" (см. LeadModalTrigger) — посетитель
// оставляет имя/телефон, не уходя со своего места (фон не прокручивается).
// ВАЖНО: реальная отправка (модель Lead + Telegram) — отдельная задача;
// сейчас сабмит показывает заглушку «спасибо».
const DEFAULT_TITLE = "Узнать стоимость строительства";

export default function LeadModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent<{ title?: string }>).detail;
      setTitle(detail?.title || DEFAULT_TITLE);
      setSent(false);
      setOpen(true);
    }
    window.addEventListener("open-lead-modal", onOpen as EventListener);
    return () => window.removeEventListener("open-lead-modal", onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={() => setOpen(false)}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Закрыть" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>

        {sent ? (
          <div className="modal-success" aria-live="polite">
            <span className="modal-success-icon">
              <CheckCircle2 />
            </span>
            <strong>Спасибо! Заявка принята</strong>
            <p>Перезвоним в рабочее время и подготовим расчёт.</p>
            <button className="button primary" type="button" onClick={() => setOpen(false)}>
              Хорошо
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <h3>{title}</h3>
            <p>Оставьте контакты — посчитаем смету и перезвоним. Это бесплатно и ни к чему не обязывает.</p>
            <label>
              Имя
              <input
                ref={nameRef}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Как к вам обращаться"
              />
            </label>
            <label>
              Телефон
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+7 ___ ___-__-__"
              />
            </label>
            <ConsentField />
            <button className="button primary" type="submit">
              Отправить заявку
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

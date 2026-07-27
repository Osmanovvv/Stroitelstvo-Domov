"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ConsentField from "./ConsentField";
import { submitLead } from "../lib/leadActions";
import { reachGoal } from "../lib/metrika";

const INTERESTS: Record<string, string> = {
  "ready-house": "Готовый дом",
  construction: "Дом в строительстве",
  custom: "Строительство под заказ",
  plot: "Участок",
};

// Форма заявки в блоке «Контакты». Раньше здесь была неподключённая разметка
// (кнопка type="button" без обработчика) — посетитель заполнял поля, жал
// «Оставить заявку», и заявка НИКУДА не уходила. Теперь форма отправляется тем
// же экшеном submitLead, что модалка и квиз: запись в БД + доставка в Telegram.
export default function ContactsForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData(event.currentTarget);
      data.set("source", "Форма в блоке «Контакты»");
      // submitLead не знает поля «Интересует» — переносим его в комментарий,
      // иначе выбор посетителя потеряется по дороге.
      const interest = String(data.get("interest") ?? "");
      if (interest) data.set("message", `Интересует: ${INTERESTS[interest] ?? interest}`);

      const result = await submitLead(data);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      reachGoal("lead");
      setSent(true);
    } catch {
      setError("Не удалось отправить. Проверьте связь и попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="lead-form">
        <div className="modal-success" aria-live="polite">
          <span className="modal-success-icon">
            <CheckCircle2 />
          </span>
          <strong>Спасибо! Заявка принята</strong>
          <p>Перезвоним в рабочее время и подготовим расчёт.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      {/* honeypot — скрытое поле, видит только бот; на людей не влияет */}
      <input
        type="text"
        name="company_extra"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <label>
        Имя
        <input type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" />
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
      <label>
        Интересует
        <select name="interest" defaultValue="ready-house">
          <option value="ready-house">Готовый дом</option>
          <option value="construction">Дом в строительстве</option>
          <option value="custom">Строительство под заказ</option>
          <option value="plot">Участок</option>
        </select>
      </label>
      <ConsentField />
      {error && (
        <p role="alert" style={{ margin: "2px 0 0", color: "#dc2626", fontSize: 13 }}>
          {error}
        </p>
      )}
      <button className="button primary" type="submit" disabled={submitting}>
        {submitting ? "Отправляем…" : "Оставить заявку"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}

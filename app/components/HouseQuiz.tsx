"use client";

import { type FormEvent, useState } from "react";
import {
  ArrowRight,
  Calculator,
  Check,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import {
  getOptionLabel,
  initialAnswers,
  optionSteps,
  type QuizAnswers,
} from "../content/quiz";
import ConsentField from "./ConsentField";
import { submitLead } from "../lib/leadActions";
import { reachGoal } from "../lib/metrika";

type Props = {
  // "section" — полный блок «Подбор и расчёт» внизу; "hero" — компактный вариант
  // на первом экране справа. Отличается только оформлением (класс is-hero в CSS).
  variant?: "section" | "hero";
  // Фото для Шага 1 (направление), ключ = option.value ("ready"/"build"/"plot").
  // Приходят из настроек с фолбэком на quizTargetDefaults (см. серверные секции).
  targetImages?: Record<string, string>;
};

export default function HouseQuiz({ variant = "section", targetImages }: Props) {
  const isHero = variant === "hero";
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = optionSteps.length + 1;
  const isContactStep = stepIndex === optionSteps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const currentStep = optionSteps[stepIndex];
  // Согласие не входит в условие: кнопка остается активной, и при сабмите без
  // галочки браузер сам показывает подсказку у required-чекбокса (onSubmit не
  // вызывается, пока нативная валидация не пройдена).
  const canContinue = isContactStep ? answers.phone.trim().length >= 6 : Boolean(answers[currentStep.key]);

  function updateAnswer(key: keyof QuizAnswers, value: string) {
    setAnswers((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function goNext() {
    if (!isContactStep && canContinue) {
      setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
    }
  }

  function goBack() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isContactStep) {
      goNext();
      return;
    }

    if (!canContinue || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData(event.currentTarget);
      data.set("source", "Квиз подбора");
      data.set(
        "message",
        [
          `Направление: ${getOptionLabel("target", answers.target)}`,
          `Площадь: ${getOptionLabel("area", answers.area)}`,
          `Покупка: ${getOptionLabel("payment", answers.payment)}`,
        ].join("; "),
      );
      const result = await submitLead(data);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      reachGoal("lead");
      setIsSent(true);
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetQuiz() {
    setAnswers(initialAnswers);
    setStepIndex(0);
    setIsSent(false);
    setSubmitting(false);
    setError(null);
  }

  if (isSent) {
    return (
      <div className={`quiz-card quiz-success${isHero ? " is-hero" : ""}`} aria-live="polite">
        <div className="quiz-success-icon">
          <CheckCircle2 />
        </div>
        <div className="quiz-top">
          <span>Подбор сформирован</span>
          <strong>Спасибо, заявка на расчет готова</strong>
          <small>Мы уже собрали основные параметры для подбора дома и расчета.</small>
        </div>
        <div className="quiz-summary">
          <span>
            <strong>Направление</strong>
            {getOptionLabel("target", answers.target)}
          </span>
          <span>
            <strong>Площадь</strong>
            {getOptionLabel("area", answers.area)}
          </span>
          <span>
            <strong>Покупка</strong>
            {getOptionLabel("payment", answers.payment)}
          </span>
        </div>
        <button className="button primary" type="button" onClick={resetQuiz}>
          Заполнить заново
        </button>
      </div>
    );
  }

  return (
    <form className={`quiz-card${isHero ? " is-hero" : ""}`} onSubmit={handleSubmit}>
      {/* honeypot — скрытое поле, видит только бот; на людей не влияет */}
      <input
        type="text"
        name="company_extra"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="quiz-top">
        <span>Шаг {stepIndex + 1} из {totalSteps}</span>
        <strong>{isContactStep ? "Куда отправить подбор?" : currentStep.title}</strong>
        <small>
          {isContactStep
            ? "Оставьте контакт, чтобы получить расчет и ближайшие подходящие варианты."
            : currentStep.subtitle}
        </small>
      </div>

      <div className="quiz-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      {!isContactStep ? (
        <div className={`quiz-options ${currentStep.key === "target" ? "is-photo" : "is-icon"}`}>
          {currentStep.options.map((option) => {
            const Icon = option.icon;
            const isActive = answers[currentStep.key] === option.value;
            // Фото-пиктограмма только на Шаге 1 (направление); остальные шаги —
            // цветная иконка-чип. Пусто/нет ключа → иконка (безопасный фолбэк).
            const image =
              currentStep.key === "target" ? targetImages?.[option.value] : undefined;

            return (
              <button
                className={`quiz-option${isActive ? " active" : ""}`}
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateAnswer(currentStep.key, option.value)}
              >
                {image ? (
                  <span
                    className="quiz-option-media photo"
                    style={{ backgroundImage: `url("${image}")` }}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="quiz-option-media icon" aria-hidden="true">
                    <Icon />
                  </span>
                )}
                <span className="quiz-option-text">
                  <span className="quiz-option-label">{option.label}</span>
                  <small>{option.note}</small>
                </span>
                <span className="quiz-option-check" aria-hidden="true">
                  <Check size={15} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="quiz-contact-grid">
            <label>
              Имя
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={answers.name}
                placeholder="Как к вам обращаться"
                onChange={(event) => updateAnswer("name", event.target.value)}
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
                value={answers.phone}
                placeholder="+7 ___ ___-__-__"
                onChange={(event) => updateAnswer("phone", event.target.value)}
              />
            </label>
          </div>
          <div className="quiz-summary">
            <span>
              <strong>Направление</strong>
              {getOptionLabel("target", answers.target)}
            </span>
            <span>
              <strong>Площадь</strong>
              {getOptionLabel("area", answers.area)}
            </span>
            <span>
              <strong>Покупка</strong>
              {getOptionLabel("payment", answers.payment)}
            </span>
          </div>
          <ConsentField />
          {error && (
            <p role="alert" style={{ margin: "2px 0 0", color: "#dc2626", fontSize: 13 }}>
              {error}
            </p>
          )}
        </>
      )}

      <div className={`quiz-actions${stepIndex === 0 ? " single" : ""}`}>
        {stepIndex > 0 && (
          <button className="quiz-back" type="button" onClick={goBack}>
            <ChevronLeft size={17} />
            Назад
          </button>
        )}
        <button className="button primary" type={isContactStep ? "submit" : "button"} onClick={isContactStep ? undefined : goNext} disabled={!canContinue || submitting}>
          {isContactStep ? (
            <>
              <Calculator size={18} />
              {submitting ? "Отправляем…" : "Получить расчет"}
            </>
          ) : (
            <>
              Далее
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

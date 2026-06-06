"use client";

import { type FormEvent, useState } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import {
  getOptionLabel,
  initialAnswers,
  optionSteps,
  type QuizAnswers,
} from "../content/quiz";

export default function HouseQuiz() {
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSent, setIsSent] = useState(false);

  const totalSteps = optionSteps.length + 1;
  const isContactStep = stepIndex === optionSteps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const currentStep = optionSteps[stepIndex];
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isContactStep) {
      goNext();
      return;
    }

    if (canContinue) {
      setIsSent(true);
    }
  }

  function resetQuiz() {
    setAnswers(initialAnswers);
    setStepIndex(0);
    setIsSent(false);
  }

  if (isSent) {
    return (
      <div className="quiz-card quiz-success" aria-live="polite">
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
    <form className="quiz-card" onSubmit={handleSubmit}>
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
        <div className="quiz-options">
          {currentStep.options.map((option) => {
            const Icon = option.icon;
            const isActive = answers[currentStep.key] === option.value;

            return (
              <button
                className={`quiz-option${isActive ? " active" : ""}`}
                key={option.value}
                type="button"
                onClick={() => updateAnswer(currentStep.key, option.value)}
              >
                <Icon />
                <span>{option.label}</span>
                <small>{option.note}</small>
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
        </>
      )}

      <div className={`quiz-actions${stepIndex === 0 ? " single" : ""}`}>
        {stepIndex > 0 && (
          <button className="quiz-back" type="button" onClick={goBack}>
            <ChevronLeft size={17} />
            Назад
          </button>
        )}
        <button className="button primary" type={isContactStep ? "submit" : "button"} onClick={isContactStep ? undefined : goNext} disabled={!canContinue}>
          {isContactStep ? (
            <>
              <Calculator size={18} />
              Получить расчет
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

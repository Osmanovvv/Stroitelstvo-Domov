"use client";

import { type FormEvent, useState } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Hammer,
  House,
  Ruler,
  Trees,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

type QuizKey = "target" | "area" | "payment";

type QuizOption = {
  value: string;
  label: string;
  note: string;
  icon: LucideIcon;
};

type QuizStep = {
  key: QuizKey;
  title: string;
  subtitle: string;
  options: QuizOption[];
};

type QuizAnswers = Record<QuizKey, string> & {
  name: string;
  phone: string;
};

const optionSteps: QuizStep[] = [
  {
    key: "target",
    title: "Какой вариант рассматриваете?",
    subtitle: "Выберите направление, чтобы мы сразу предложили подходящие варианты.",
    options: [
      {
        value: "ready",
        label: "Готовый дом",
        note: "Можно приехать на просмотр",
        icon: House,
      },
      {
        value: "build",
        label: "Строительство",
        note: "Дом под ваш участок и бюджет",
        icon: Hammer,
      },
      {
        value: "plot",
        label: "Дом + участок",
        note: "Подберем землю и проект",
        icon: Trees,
      },
    ],
  },
  {
    key: "area",
    title: "Какая площадь нужна?",
    subtitle: "Ориентир нужен для первичного расчета стоимости и комплектации.",
    options: [
      {
        value: "80-100",
        label: "80-100 м²",
        note: "Компактный дом для семьи",
        icon: Ruler,
      },
      {
        value: "100-120",
        label: "100-120 м²",
        note: "Оптимальный семейный формат",
        icon: Ruler,
      },
      {
        value: "120-140",
        label: "120-140 м²",
        note: "Больше комнат и свободного места",
        icon: Ruler,
      },
    ],
  },
  {
    key: "payment",
    title: "Как планируете покупку?",
    subtitle: "Учтем ипотеку, бронь объекта или поэтапную оплату строительства.",
    options: [
      {
        value: "mortgage",
        label: "Ипотека",
        note: "Сбер, Альфа, ВТБ, Дом.РФ",
        icon: WalletCards,
      },
      {
        value: "cash",
        label: "Свои средства",
        note: "Подберем понятную комплектацию",
        icon: Calculator,
      },
      {
        value: "later",
        label: "Пока сравниваю",
        note: "Покажем несколько сценариев",
        icon: Clock3,
      },
    ],
  },
];

const initialAnswers: QuizAnswers = {
  target: "ready",
  area: "100-120",
  payment: "mortgage",
  name: "",
  phone: "",
};

function getOptionLabel(key: QuizKey, value: string) {
  return optionSteps
    .find((step) => step.key === key)
    ?.options.find((option) => option.value === value)?.label ?? value;
}

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

import {
  Calculator,
  Clock3,
  Hammer,
  House,
  Ruler,
  Trees,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type QuizKey = "target" | "area" | "payment";

export type QuizOption = {
  value: string;
  label: string;
  note: string;
  icon: LucideIcon;
};

export type QuizStep = {
  key: QuizKey;
  title: string;
  subtitle: string;
  options: QuizOption[];
};

export type QuizAnswers = Record<QuizKey, string> & {
  name: string;
  phone: string;
};

export const optionSteps: QuizStep[] = [
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

export const initialAnswers: QuizAnswers = {
  target: "ready",
  area: "100-120",
  payment: "mortgage",
  name: "",
  phone: "",
};

export function getOptionLabel(key: QuizKey, value: string) {
  return (
    optionSteps
      .find((step) => step.key === key)
      ?.options.find((option) => option.value === value)?.label ?? value
  );
}

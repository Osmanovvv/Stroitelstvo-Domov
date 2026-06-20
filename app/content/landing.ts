import {
  Camera,
  ClipboardCheck,
  FileCheck2,
  Hammer,
  House,
  Phone,
  Ruler,
  ShieldCheck,
  Trees,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { safeHref } from "../lib/url";

// Рантайм-контент сайта: статичные блоки и хелперы. Меняемые через админку
// данные (дома/проекты/цены/настройки) живут в БД, а данные для первичного
// наполнения — в prisma/seed-data.ts.

export type IconCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type ChoiceItem = IconCard & {
  href: string;
};

export type BankItem = {
  name: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
};

export type ProcessStep = IconCard & {
  number: string;
};

export type ContactLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
  logo?: string;
  external?: boolean;
};

export const trustItems: IconCard[] = [
  {
    icon: ClipboardCheck,
    title: "Фиксируем смету",
    text: "До старта согласуем комплектацию, этапы и стоимость, чтобы вы понимали итоговый бюджет.",
  },
  {
    icon: Camera,
    title: "Показываем объекты",
    text: "Можно приехать на готовый дом или стройку и увидеть качество работ до заключения договора.",
  },
  {
    icon: ShieldCheck,
    title: "Работаем по договору",
    text: "Прописываем сроки, этапы оплаты, комплектацию, ответственность и гарантийные обязательства.",
  },
];

export const choiceItems: ChoiceItem[] = [
  {
    icon: House,
    title: "Купить готовый дом",
    text: "Объекты с участком и коммуникациями",
    href: "#homes",
  },
  {
    icon: Hammer,
    title: "Посмотреть стройку",
    text: "Покажем этап, качество и срок сдачи",
    href: "#building",
  },
  {
    icon: Ruler,
    title: "Выбрать проект",
    text: "Планировки 80-140 м² под бюджет",
    href: "#projects",
  },
  {
    icon: Trees,
    title: "Подобрать участок",
    text: "Земля под дом без отдельного поиска",
    href: "#plots",
  },
];

export const bankItems: BankItem[] = [
  {
    name: "Сбер",
    logo: "/bank-logos/sber.svg",
    logoWidth: 150,
    logoHeight: 25,
  },
  {
    name: "Альфа-Банк",
    logo: "/bank-logos/alfa.svg",
    logoWidth: 160,
    logoHeight: 33,
  },
  {
    name: "ВТБ",
    logo: "/bank-logos/vtb.svg",
    logoWidth: 139,
    logoHeight: 50,
  },
  {
    name: "Дом.РФ",
    logo: "/bank-logos/domrf.png",
    logoWidth: 98,
    logoHeight: 60,
  },
];

export const processSteps: ProcessStep[] = [
  {
    icon: House,
    number: "01",
    title: "Подбор",
    text: "Выбираем готовый дом, проект или участок.",
  },
  {
    icon: Camera,
    number: "02",
    title: "Просмотр",
    text: "Показываем объект, стройку или планировку.",
  },
  {
    icon: FileCheck2,
    number: "03",
    title: "Смета",
    text: "Фиксируем комплектацию, цену и сроки.",
  },
  {
    icon: Trophy,
    number: "04",
    title: "Договор",
    text: "Запускаем сделку или строительство по этапам.",
  },
];

export const heroDefaults = {
  // Перенос строки — с новой строки (Enter). Текст между **двумя звёздочками**
  // подсвечивается акцентным цветом, напр. **в Краснодаре**.
  title: "Кирпичные дома **в Краснодаре** и радиусе 70 км",
  subtitle:
    "Подберем готовый дом, объект в строительстве или типовой проект под ваш участок, бюджет и срок переезда.",
  image: "/hero/brick-house-dusk.webp",
};

export const navigationLinks = [
  { label: "Готовые дома", href: "#homes" },
  { label: "Проекты", href: "#projects" },
  { label: "Участки", href: "#plots" },
  { label: "Цены", href: "#prices" },
];

export const mobileNavigationLinks = [
  { label: "Готовые дома", href: "#homes" },
  { label: "Строящиеся дома", href: "#building" },
  { label: "Проекты", href: "#projects" },
  { label: "Участки", href: "#plots" },
  { label: "Цены", href: "#prices" },
  { label: "Контакты", href: "#contacts" },
];

// Реквизиты оператора ПДн. Значения-заглушки помечены «уточняется» — заказчик
// заполняет реальные через админку («Настройки»), отсюда берутся фолбэки и сид.
export const legalDefaults: Record<string, string> = {
  legal_operator_name: "Наименование оператора уточняется (ИП / ООО)",
  legal_inn: "уточняется",
  legal_ogrn: "уточняется",
  legal_address: "г. Краснодар (адрес уточняется)",
  legal_email: "адрес электронной почты уточняется",
  legal_updated: "11.06.2026",
};

export type LegalInfo = {
  operatorName: string;
  inn: string;
  ogrn: string;
  address: string;
  email: string;
  updated: string;
};

// Админка сохраняет дату редакции через input type="date" (ГГГГ-ММ-ДД) —
// на страницах показываем в привычном виде ДД.ММ.ГГГГ.
function formatLegalDate(value: string): string {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return iso ? `${iso[3]}.${iso[2]}.${iso[1]}` : value;
}

export function buildLegalInfo(settings: Record<string, string>): LegalInfo {
  return {
    operatorName: settings.legal_operator_name || legalDefaults.legal_operator_name,
    inn: settings.legal_inn || legalDefaults.legal_inn,
    ogrn: settings.legal_ogrn || legalDefaults.legal_ogrn,
    address: settings.legal_address || legalDefaults.legal_address,
    email: settings.legal_email || legalDefaults.legal_email,
    updated: formatLegalDate(settings.legal_updated || legalDefaults.legal_updated),
  };
}

export function buildContactLinks(settings: Record<string, string>): ContactLink[] {
  return [
    { label: "Позвонить", href: settings.phone ? `tel:${settings.phone}` : "#", icon: Phone },
    {
      label: "WhatsApp",
      href: safeHref(settings.whatsapp_url),
      logo: "/social-icons/whatsapp.svg",
      external: true,
    },
    {
      label: "Telegram",
      href: safeHref(settings.telegram_url),
      logo: "/social-icons/telegram.svg",
      external: true,
    },
    { label: "MAX", href: safeHref(settings.max_url), logo: "/social-icons/max.svg", external: true },
  ];
}

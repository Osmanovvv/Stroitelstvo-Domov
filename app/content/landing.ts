import {
  Camera,
  ClipboardCheck,
  FileCheck2,
  Hammer,
  House,
  KeyRound,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Trees,
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
    icon: ClipboardCheck,
    number: "01",
    title: "Заявка и консультация",
    text: "Уточняем тип дома, площадь, бюджет и считаем предварительную стоимость.",
  },
  {
    icon: Ruler,
    number: "02",
    title: "Проект",
    text: "Подбираем готовый проект из каталога или разрабатываем индивидуальный.",
  },
  {
    icon: MapPin,
    number: "03",
    title: "Выезд на участок",
    text: "Инженер оценивает грунт и подъезды, подбирает фундамент и уточняет смету.",
  },
  {
    icon: FileCheck2,
    number: "04",
    title: "Договор",
    text: "Фиксируем смету, гарантии, график работ и поэтапную оплату.",
  },
  {
    icon: Hammer,
    number: "05",
    title: "Строительство",
    text: "Одна команда ведёт коробку, кровлю, инженерию и отделку с контролем качества.",
  },
  {
    icon: KeyRound,
    number: "06",
    title: "Сдача и гарантия",
    text: "Передаём дом с документами и гарантией на конструкции и инженерию.",
  },
];

// Преимущества ипотеки/рассрочки для тёмного блока «Ипотека».
// ВНИМАНИЕ: ставка и суммы — маркетинговые плейсхолдеры. Реклама финансовых
// услуг требует полных условий; заказчик обязан подтвердить реальные цифры.
export const mortgageFeatures = [
  {
    title: "Ставка от 5,9%",
    text: "Закреплена на весь срок — без скрытых переплат.",
  },
  {
    title: "Семейная и господдержка",
    text: "Подберём программу под ваш случай: семейная, IT, господдержка.",
  },
  {
    title: "Платёж от 25 000 ₽/мес",
    text: "Свой дом — дешевле аренды. Посчитаем под ваш бюджет.",
  },
  {
    title: "Эскроу-счёт",
    text: "Деньги в банке; застройщик получает их после этапов работ.",
  },
];

export const heroDefaults = {
  // Перенос строки — с новой строки (Enter). Текст между **двумя звёздочками**
  // подсвечивается акцентным цветом, напр. **в Краснодаре**.
  title: "Кирпичные дома **в Краснодаре** и радиусе 70 км",
  subtitle:
    "Подберем готовый дом, объект в строительстве или типовой проект под ваш участок, бюджет и срок переезда.",
  image: "/hero/brick-house-dusk.webp",
  // Бейджи-преимущества под подзаголовком. Текст редактируется в админке
  // (ключи hero_badge_1..3); иконки фиксированы по позиции. Пусто = дефолт отсюда.
  badges: ["Договор и смета", "Объекты можно посмотреть", "Ипотека Сбер, ВТБ, Альфа"],
};

// Блок «Дом или квартира» (CompareSection). Тексты редактируются в админке
// (ключи compare_*); в заголовке **двойными звёздочками** выделяется акцент.
// Списки «features» — по одному пункту на строку. Пусто = дефолт отсюда.
export const compareDefaults = {
  eyebrow: "Дом или квартира",
  title: "Сравните **дом в ипотеку** и квартиру в аренду",
  subtitle:
    "Для семей, которые переезжают в Краснодар, показываем понятную разницу: площадь, участок, платеж и уровень свободы.",
  houseTitle: "Дом",
  houseFeatures: ["от 94 м²", "участок от 5 соток", "своя парковка и двор"],
  housePrice: "от 40 000 ₽ / месяц",
  flatTitle: "Квартира",
  flatFeatures: ["60-80 м²", "без участка", "аренда без собственности"],
  flatPrice: "от 40 000 ₽ / месяц",
};

// Блок «Подбор и расчёт» (CalculatorSection). Редактируются тексты вводной
// (ключи calc_*) и фон секции (calc_bg_image — загруженная картинка; пусто =
// фирменный градиент). В заголовке **двойными звёздочками** — акцент.
export const calcDefaults = {
  eyebrow: "Подбор и расчет",
  title: "Подберите **лучший дом** под ваши критерии",
  subtitle:
    "Ответьте на несколько вопросов, и мы подготовим ориентир по стоимости, ипотеке, комплектации и подходящим вариантам.",
};

// Комплектации строительства (карточки в секции «Цены»). Заголовок/подзаголовок
// и список работ редактируются в админке (ключи SiteSetting price_<key>_label /
// _sub / _items); _items — по одной работе на строку. Пусто = дефолт отсюда.
export type PackageInfo = {
  key: "warm" | "pre" | "full";
  title: string;
  sub: string;
  items: string[];
};

export const packageDefaults: PackageInfo[] = [
  {
    key: "warm",
    title: "Тёплый контур",
    sub: "Включает в себя:",
    items: [
      "Подготовительные работы: выбор или разработка проекта дома",
      "Устройство фундамента с закладными под коммуникации",
      "Устройство несущих стен, внешних и внутренних",
      "Устройство перекрытий",
      "Монтаж внутренних перегородок",
      "Устройство монолитной железобетонной лестницы",
      "Устройство утеплённой кровли",
      "Изготовление и монтаж окон",
    ],
  },
  {
    key: "pre",
    title: "White box",
    sub: "Включает «тёплый контур», а также:",
    items: [
      "Работы по отделке фасада",
      "Монтаж водосточной системы",
      "Подшивка карнизных свесов",
      "Внутренняя штукатурка стен и откосов",
      "Монтаж системы отопления и водоснабжения",
      "Монтаж черновой электрики со щитом и заземлением",
      "Устройство черновой стяжки пола",
    ],
  },
  {
    key: "full",
    title: "Под ключ",
    sub: "Включает «White box», а также:",
    items: [
      "Подготовка стен к финишному покрытию",
      "Покраска оконных откосов и монтаж подоконников",
      "Поклейка обоев, покраска стен, монтаж плитки",
      "Монтаж напольных покрытий (плитка, ламинат и пр.)",
      "Монтаж потолков и приборов освещения",
      "Монтаж межкомнатных дверей",
      "Монтаж чистовой сантехники, розеток и выключателей",
      "Меблировка и бытовая техника (по опциям)",
    ],
  },
];

export function buildPackages(settings: Record<string, string>): PackageInfo[] {
  return packageDefaults.map((p) => {
    const itemsRaw = settings[`price_${p.key}_items`];
    const items = itemsRaw
      ? itemsRaw.split("\n").map((line) => line.trim()).filter(Boolean)
      : p.items;
    return {
      key: p.key,
      title: settings[`price_${p.key}_label`] || p.title,
      sub: settings[`price_${p.key}_sub`] || p.sub,
      items,
    };
  });
}

// Плоские дефолтные настройки пакетов для сида/скрипта инициализации.
export function packageSettingDefaults(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of packageDefaults) {
    out[`price_${p.key}_label`] = p.title;
    out[`price_${p.key}_sub`] = p.sub;
    out[`price_${p.key}_items`] = p.items.join("\n");
  }
  return out;
}

export const navigationLinks = [
  { label: "Проекты", href: "#projects" },
  { label: "Готовые дома в продаже", href: "#homes" },
  { label: "Объекты в строительстве", href: "#building" },
  { label: "Участки", href: "#plots" },
  { label: "Построенные объекты", href: "#built" },
  { label: "Ипотека", href: "#mortgage" },
  { label: "Как мы работаем", href: "#process" },
];

export const mobileNavigationLinks = [
  { label: "Проекты", href: "#projects" },
  { label: "Готовые дома в продаже", href: "#homes" },
  { label: "Объекты в строительстве", href: "#building" },
  { label: "Участки", href: "#plots" },
  { label: "Построенные объекты", href: "#built" },
  { label: "Ипотека", href: "#mortgage" },
  { label: "Как мы работаем", href: "#process" },
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

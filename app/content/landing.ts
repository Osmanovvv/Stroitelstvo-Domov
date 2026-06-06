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

export type ReadyHome = {
  title: string;
  price: string;
  area: string;
  land: string;
  rooms: string;
  baths: string;
  location: string;
  status: string;
  image: string;
};

export type Project = {
  name: string;
  area: string;
  floors: string;
  price: string;
  time: string;
  tag: string;
  description: string;
  image: string;
};

export type BuildingHome = {
  title: string;
  stage: string;
  finish: string;
  location: string;
};

export type Plot = {
  title: string;
  area: string;
  utilities: string;
  location: string;
};

export type IconCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type PriceRow = {
  work: string;
  warm: string;
  pre: string;
  full: string;
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

export const readyHomes: ReadyHome[] = [
  {
    title: "Дом в Немецкой Деревне",
    price: "от 12,8 млн ₽",
    area: "126 м²",
    land: "5,6 сот.",
    rooms: "4 комнаты",
    baths: "2 санузла",
    location: "Краснодар, западное направление",
    status: "готов к просмотру",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Кирпичный дом у парковой зоны",
    price: "от 10,9 млн ₽",
    area: "108 м²",
    land: "4,8 сот.",
    rooms: "3 комнаты",
    baths: "2 санузла",
    location: "Краснодар +25 км",
    status: "чистовая отделка",
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Одноэтажный дом для семьи",
    price: "от 9,7 млн ₽",
    area: "94 м²",
    land: "5 сот.",
    rooms: "3 комнаты",
    baths: "1 санузел",
    location: "Краснодар +40 км",
    status: "можно заехать",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Дом с террасой у зеленой зоны",
    price: "от 11,6 млн ₽",
    area: "120 м²",
    land: "5,2 сот.",
    rooms: "4 комнаты",
    baths: "2 санузла",
    location: "Краснодар +30 км",
    status: "готов к сделке",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Семейный дом с просторной кухней",
    price: "от 13,4 млн ₽",
    area: "138 м²",
    land: "6 сот.",
    rooms: "5 комнат",
    baths: "2 санузла",
    location: "Краснодар, северное направление",
    status: "ипотека возможна",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
];

export const projects: Project[] = [
  {
    name: "Клевер 80",
    area: "80 м²",
    floors: "1 этаж",
    price: "от 5,8 млн ₽",
    time: "4 месяца",
    tag: "Для компактного участка",
    description: "Одноэтажный дом с простой посадкой на участок и понятной сметой.",
    image: "/projects/project-klever-80.jpg",
  },
  {
    name: "Южный 104",
    area: "104 м²",
    floors: "1 этаж",
    price: "от 7,1 млн ₽",
    time: "5 месяцев",
    tag: "Готовый семейный формат",
    description: "Удобная планировка для семьи: кухня-гостиная, спальни и терраса.",
    image: "/projects/project-yuzhny-104.jpg",
  },
  {
    name: "Семейный 126",
    area: "126 м²",
    floors: "2 этажа",
    price: "от 8,9 млн ₽",
    time: "6 месяцев",
    tag: "Больше приватных зон",
    description: "Двухэтажный проект с выразительным фасадом и запасом по комнатам.",
    image: "/projects/project-semeyny-126.jpg",
  },
  {
    name: "Видный 140",
    area: "140 м²",
    floors: "2 этажа",
    price: "от 9,6 млн ₽",
    time: "6 месяцев",
    tag: "Премиальный вид",
    description: "Просторный дом для участка с парадным фасадом и большой гостиной.",
    image: "/projects/project-vidny-140.jpg",
  },
  {
    name: "Практичный 92",
    area: "92 м²",
    floors: "1 этаж",
    price: "от 6,4 млн ₽",
    time: "4 месяца",
    tag: "Рациональная смета",
    description: "Базовый вариант для быстрого старта строительства без лишних метров.",
    image: "/projects/project-praktichny-92.jpg",
  },
  {
    name: "Комфорт 118",
    area: "118 м²",
    floors: "1 этаж",
    price: "от 8,1 млн ₽",
    time: "5 месяцев",
    tag: "Теплый фасад",
    description: "Одноэтажное решение с акцентом на уютный вход и спокойную архитектуру.",
    image: "/projects/project-komfort-118.jpg",
  },
  {
    name: "Простор 136",
    area: "136 м²",
    floors: "2 этажа",
    price: "от 9,3 млн ₽",
    time: "6 месяцев",
    tag: "Для большой семьи",
    description: "Проект с большим остеклением, террасой и выразительной вечерней подачей.",
    image: "/projects/project-prostor-136.jpg",
  },
];

export const buildingHomes: BuildingHome[] = [
  {
    title: "Дом 118 м²",
    stage: "коробка готова",
    finish: "сдача в августе",
    location: "Краснодар +30 км",
  },
  {
    title: "Дом 132 м²",
    stage: "кровельные работы",
    finish: "сдача в сентябре",
    location: "Краснодар +55 км",
  },
  {
    title: "Дом 96 м²",
    stage: "фундамент и стены",
    finish: "сдача в октябре",
    location: "пригород Краснодара",
  },
  {
    title: "Дом 124 м²",
    stage: "кладка стен",
    finish: "сдача в ноябре",
    location: "Краснодар +35 км",
  },
  {
    title: "Дом 140 м²",
    stage: "инженерные работы",
    finish: "сдача в декабре",
    location: "южное направление",
  },
];

export const plots: Plot[] = [
  {
    title: "Участок под дом 104 м²",
    area: "5 сот.",
    utilities: "свет, вода рядом",
    location: "Краснодар +20 км",
  },
  {
    title: "Участок под дом 126 м²",
    area: "6 сот.",
    utilities: "подъезд, электричество",
    location: "Краснодар +45 км",
  },
  {
    title: "Участок под семейный проект",
    area: "7 сот.",
    utilities: "коммуникации по границе",
    location: "южное направление",
  },
];

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

export const faqItems: FaqItem[] = [
  {
    question: "Можно ли посмотреть готовый дом перед покупкой?",
    answer: "Да, для готовых домов и части строящихся объектов можно назначить просмотр.",
  },
  {
    question: "Можно ли построить дом на вашем участке?",
    answer: "Да, можно выбрать участок из доступных вариантов и подобрать проект под конкретную землю.",
  },
  {
    question: "Что входит в стоимость строительства?",
    answer: "Стоимость зависит от комплектации: теплый контур, предчистовая или под ключ.",
  },
  {
    question: "Можно ли изменить типовой проект?",
    answer: "Да, планировку можно адаптировать до начала проектирования и расчета сметы.",
  },
];

export const priceRows: PriceRow[] = [
  {
    work: "Фундамент",
    warm: "монолитная плита",
    pre: "монолитная плита",
    full: "монолитная плита",
  },
  {
    work: "Стены",
    warm: "кирпич + утепление",
    pre: "кирпич + утепление",
    full: "кирпич + утепление",
  },
  {
    work: "Кровля",
    warm: "металлочерепица",
    pre: "металлочерепица",
    full: "металлочерепица",
  },
  {
    work: "Окна и двери",
    warm: "входная дверь, окна",
    pre: "входная дверь, окна",
    full: "входная дверь, окна",
  },
  {
    work: "Инженерия",
    warm: "по проекту",
    pre: "электрика, вода, канализация",
    full: "электрика, вода, отопление",
  },
  {
    work: "Отделка",
    warm: "не входит",
    pre: "стяжка, штукатурка",
    full: "чистовая отделка",
  },
  {
    work: "Готовность",
    warm: "под закрытый контур",
    pre: "под финишную отделку",
    full: "можно заезжать",
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

export const contactLinks: ContactLink[] = [
  {
    label: "Позвонить",
    href: "tel:+79990000000",
    icon: Phone,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/79990000000",
    logo: "/social-icons/whatsapp.svg",
    external: true,
  },
  {
    label: "Telegram",
    href: "https://t.me/username",
    logo: "/social-icons/telegram.svg",
    external: true,
  },
  {
    label: "MAX",
    href: "https://max.ru/",
    logo: "/social-icons/max.svg",
    external: true,
  },
];

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

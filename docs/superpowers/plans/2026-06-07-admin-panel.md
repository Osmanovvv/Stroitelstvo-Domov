# Админ-панель — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить в текущий Next.js-лендинг защищённую админ-панель `/admin`, через которую заказчик редактирует основное наполнение (дома, проекты, участки, цены, FAQ, настройки), с переносом текущего тестового контента в PostgreSQL.

**Architecture:** Тот же Next.js-проект (App Router). Данные в PostgreSQL через Prisma. Публичные секции (Server Components) читают контент из базы через слой `app/lib/queries.ts`. Админка использует Server Actions для CRUD и загрузки фото. Авторизация — один аккаунт из `.env`, сессия в подписанном httpOnly-cookie (jose), защита через `middleware.ts`. После любого изменения вызывается `revalidatePath('/')`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma + PostgreSQL (Docker для разработки), bcryptjs (хэш пароля), jose (сессия), tsx (seed и тесты).

---

## Замечания по процессу (прочитать перед стартом)

- **Тестирование.** В проекте нет тест-раннера, а основная работа — интеграционная (БД, формы, загрузка файлов, UI). Поэтому проверка в большинстве задач — это `npx tsc --noEmit` (типы), `npm run lint`, `npm run build` и ручная/браузерная проверка в работающем приложении. Для чистой логики (подпись/проверка сессии) добавлен один настоящий тест на `node --test` через `tsx`. Это осознанное, честное отклонение от строгого unit-TDD под реальный стек.
- **Git.** Проект сейчас НЕ под git. **Задача 1** (опционально) инициализирует репозиторий. Если git не нужен — пропусти все шаги «Commit». Команды коммитов даны на случай, если git включён.
- **Docker.** Нужен установленный Docker Desktop для локального PostgreSQL.
- **Порядок.** Задачи идут фазами A→E. Внутри фазы — по порядку.

---

## Карта файлов

**Создаются:**
- `prisma/schema.prisma` — модели БД.
- `prisma/seed.ts` — перенос текущего контента в базу.
- `.env` — переменные окружения (gitignored).
- `.env.example` — шаблон переменных.
- `app/lib/db.ts` — singleton Prisma Client.
- `app/lib/queries.ts` — функции чтения для публичного сайта.
- `app/lib/session.ts` — подпись/проверка сессионного токена (jose, edge-safe).
- `app/lib/session.test.ts` — тест session.
- `app/lib/auth.ts` — проверка логина/пароля (bcryptjs, node).
- `app/lib/upload.ts` — сохранение загруженного фото в `public/uploads`.
- `app/lib/form.ts` — хелперы чтения полей из FormData.
- `middleware.ts` — защита `/admin/*`.
- `app/admin/layout.tsx` — оболочка админки (меню, шапка).
- `app/admin/admin.css` — стили админки.
- `app/admin/login/page.tsx`, `app/admin/login/actions.ts` — вход.
- `app/admin/page.tsx` — дашборд.
- `app/admin/components/*` — общие UI-компоненты админки.
- `app/admin/homes/*`, `projects/*`, `building/*`, `plots/*`, `prices/*`, `faq/*`, `settings/*` — разделы CRUD.
- `app/admin/actions/*.ts` — Server Actions по разделам.

**Изменяются:**
- `package.json` — зависимости и скрипты.
- `.gitignore` — добавить `/public/uploads`.
- `app/content/landing.ts` — добавить `buildContactLinks()`; массивы остаются как seed-источник.
- `app/components/WorkStatus.tsx` — часы работы через props.
- `app/components/SiteHeader.tsx` — async, контакты из настроек.
- `app/layout.tsx` — `generateMetadata()` из настроек.
- Все секции в `app/components/landing/*` — чтение из базы.

---

## Фаза A — Фундамент (БД, Prisma, сид)

### Task 1 (опционально): Инициализация git

**Files:** репозиторий целиком.

- [ ] **Step 1: Инициализировать репозиторий**

Run:
```bash
git init
git add -A
git commit -m "chore: snapshot before admin panel"
```
Expected: создан репозиторий, первый коммит. Если git не нужен — пропусти задачу целиком.

---

### Task 2: Установка зависимостей

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Установить рантайм- и dev-зависимости**

Run:
```bash
npm install @prisma/client bcryptjs jose
npm install -D prisma tsx @types/bcryptjs
```
Expected: пакеты добавлены в `package.json`, установка без ошибок.

- [ ] **Step 2: Добавить скрипты и конфиг seed в package.json**

В `package.json` в блок `"scripts"` добавить:
```json
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "postinstall": "prisma generate"
```
И добавить на верхний уровень `package.json` блок:
```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add prisma, auth and seed dependencies"
```

---

### Task 3: Локальный PostgreSQL в Docker

**Files:** нет (инфраструктура).

- [ ] **Step 1: Поднять контейнер Postgres**

Run:
```bash
docker run --name svm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=svm -p 5432:5432 -d postgres:16
```
Expected: контейнер запущен (команда вернула id). Проверка: `docker ps` показывает `svm-postgres`.

---

### Task 4: Переменные окружения

**Files:**
- Create: `.env`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Создать .env.example**

`.env.example`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/svm?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH=""
AUTH_SECRET=""
```

- [ ] **Step 2: Создать .env с реальными значениями**

Сгенерировать секрет и хэш пароля (пароль здесь `admin123` — потом сменить):
```bash
node -e "console.log('AUTH_SECRET='+require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_PASSWORD_HASH='+require('bcryptjs').hashSync('admin123',10))"
```
`.env` (подставить полученные значения):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/svm?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="<хэш из команды>"
AUTH_SECRET="<секрет из команды>"
```

- [ ] **Step 3: Добавить uploads в .gitignore**

Дописать в конец `.gitignore`:
```
/public/uploads
```

- [ ] **Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: add env template and ignore uploads"
```

---

### Task 5: Схема Prisma

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Написать схему**

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ReadyHome {
  id        String   @id @default(cuid())
  title     String
  price     String
  area      String
  land      String
  rooms     String
  baths     String
  location  String
  status    String
  image     String
  sortOrder Int      @default(0)
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  name        String
  area        String
  floors      String
  price       String
  time        String
  tag         String
  description String
  image       String
  sortOrder   Int      @default(0)
  isVisible   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BuildingHome {
  id        String   @id @default(cuid())
  title     String
  stage     String
  finish    String
  location  String
  sortOrder Int      @default(0)
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Plot {
  id        String   @id @default(cuid())
  title     String
  area      String
  utilities String
  location  String
  sortOrder Int      @default(0)
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PriceRow {
  id        String   @id @default(cuid())
  work      String
  warm      String
  pre       String
  full      String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model FaqItem {
  id        String   @id @default(cuid())
  question  String
  answer    String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SiteSetting {
  key   String @id
  value String
}
```

- [ ] **Step 2: Создать первую миграцию и сгенерировать клиент**

Run:
```bash
npx prisma migrate dev --name init
```
Expected: создана папка `prisma/migrations/...`, таблицы в базе, Prisma Client сгенерирован.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add prisma schema and initial migration"
```

---

### Task 6: Singleton Prisma Client

**Files:**
- Create: `app/lib/db.ts`

- [ ] **Step 1: Написать db.ts**

`app/lib/db.ts`:
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 2: Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add app/lib/db.ts
git commit -m "feat: add prisma client singleton"
```

---

### Task 7: Сид из текущего контента

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Написать seed.ts**

`prisma/seed.ts` (импортирует существующие массивы — ничего не теряется):
```ts
import { PrismaClient } from "@prisma/client";
import {
  readyHomes,
  projects,
  buildingHomes,
  plots,
  priceRows,
  faqItems,
} from "../app/content/landing";

const prisma = new PrismaClient();

async function main() {
  await prisma.readyHome.deleteMany();
  await prisma.project.deleteMany();
  await prisma.buildingHome.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.priceRow.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.siteSetting.deleteMany();

  await prisma.readyHome.createMany({
    data: readyHomes.map((h, i) => ({ ...h, sortOrder: i })),
  });
  await prisma.project.createMany({
    data: projects.map((p, i) => ({
      name: p.name,
      area: p.area,
      floors: p.floors,
      price: p.price,
      time: p.time,
      tag: p.tag,
      description: p.description,
      image: p.image,
      sortOrder: i,
    })),
  });
  await prisma.buildingHome.createMany({
    data: buildingHomes.map((b, i) => ({ ...b, sortOrder: i })),
  });
  await prisma.plot.createMany({
    data: plots.map((p, i) => ({ ...p, sortOrder: i })),
  });
  await prisma.priceRow.createMany({
    data: priceRows.map((r, i) => ({ ...r, sortOrder: i })),
  });
  await prisma.faqItem.createMany({
    data: faqItems.map((f, i) => ({ ...f, sortOrder: i })),
  });

  const settings: Record<string, string> = {
    phone: "+79990000000",
    whatsapp_url: "https://wa.me/79990000000",
    telegram_url: "https://t.me/username",
    max_url: "https://max.ru/",
    work_start: "08:00",
    work_end: "19:00",
    seo_title: "Кирпичные дома в Краснодаре | Готовые дома и строительство",
    seo_description:
      "Готовые кирпичные дома, дома в строительстве и строительство под заказ в Краснодаре и радиусе 70 км.",
    price_warm_label: "Теплый контур",
    price_warm_value: "от 48 000 ₽/м²",
    price_pre_label: "Предчистовая",
    price_pre_value: "от 62 000 ₽/м²",
    price_full_label: "Под ключ",
    price_full_value: "от 78 000 ₽/м²",
  };
  await prisma.siteSetting.createMany({
    data: Object.entries(settings).map(([key, value]) => ({ key, value })),
  });

  console.log("Seed complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 2: Запустить сид**

Run: `npm run db:seed`
Expected: вывод `Seed complete`, без ошибок.

- [ ] **Step 3: Проверить данные**

Run: `npx prisma studio` (открыть таблицы, убедиться что записи есть) — закрыть после проверки (Ctrl+C).
Альтернатива без UI:
```bash
node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.readyHome.count().then(c=>{console.log('homes',c);return p.$disconnect()})"
```
Expected: `homes 5`.

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: seed database from current landing content"
```

---

## Фаза B — Публичный сайт читает из базы

### Task 8: Слой запросов queries.ts

**Files:**
- Create: `app/lib/queries.ts`

- [ ] **Step 1: Написать queries.ts**

`app/lib/queries.ts`:
```ts
import { prisma } from "./db";

export function getReadyHomes() {
  return prisma.readyHome.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getProjects() {
  return prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getBuildingHomes() {
  return prisma.buildingHome.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPlots() {
  return prisma.plot.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPriceRows() {
  return prisma.priceRow.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getFaqItems() {
  return prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
```

- [ ] **Step 2: Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add app/lib/queries.ts
git commit -m "feat: add public data query layer"
```

---

### Task 9: buildContactLinks в landing.ts

**Files:**
- Modify: `app/content/landing.ts`

- [ ] **Step 1: Добавить функцию в конец landing.ts**

В конец `app/content/landing.ts` (использует уже импортированный `Phone` и тип `ContactLink`):
```ts
export function buildContactLinks(settings: Record<string, string>): ContactLink[] {
  return [
    { label: "Позвонить", href: `tel:${settings.phone ?? ""}`, icon: Phone },
    {
      label: "WhatsApp",
      href: settings.whatsapp_url || "#",
      logo: "/social-icons/whatsapp.svg",
      external: true,
    },
    {
      label: "Telegram",
      href: settings.telegram_url || "#",
      logo: "/social-icons/telegram.svg",
      external: true,
    },
    { label: "MAX", href: settings.max_url || "#", logo: "/social-icons/max.svg", external: true },
  ];
}
```

- [ ] **Step 2: Проверка типов и коммит**

Run: `npx tsc --noEmit`
Expected: без ошибок.
```bash
git add app/content/landing.ts
git commit -m "feat: add buildContactLinks helper"
```

---

### Task 10: WorkStatus принимает часы через props

**Files:**
- Modify: `app/components/WorkStatus.tsx`

- [ ] **Step 1: Переписать WorkStatus с props**

Заменить верх файла (константы и сигнатуру) так, чтобы часы приходили строками `"HH:MM"`. Полный файл `app/components/WorkStatus.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

function toMinutes(value: string, fallback: number) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return fallback;
  return h * 60 + m;
}

function getMoscowMinutes() {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

type WorkStatusProps = {
  showHours?: boolean;
  workStart?: string;
  workEnd?: string;
};

export default function WorkStatus({
  showHours = false,
  workStart = "08:00",
  workEnd = "19:00",
}: WorkStatusProps) {
  const startMinutes = toMinutes(workStart, 8 * 60);
  const endMinutes = toMinutes(workEnd, 19 * 60);

  const isWorkingNow = () => {
    const minutes = getMoscowMinutes();
    return minutes >= startMinutes && minutes < endMinutes;
  };

  const [isWorking, setIsWorking] = useState(isWorkingNow);

  useEffect(() => {
    const updateStatus = () => setIsWorking(isWorkingNow());
    const intervalId = window.setInterval(updateStatus, 60_000);
    updateStatus();
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMinutes, endMinutes]);

  return (
    <span className={`work-status ${isWorking ? "is-open" : "is-closed"}`} aria-live="polite">
      <span className="work-status-dot" aria-hidden="true" />
      <span className="work-status-copy">
        <strong>{isWorking ? "Сейчас работаем" : "Сейчас не работаем"}</strong>
        {showHours && <small>{workStart}-{workEnd} МСК</small>}
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок (вызовы WorkStatus без новых props всё ещё валидны — у них есть значения по умолчанию).

- [ ] **Step 3: Commit**

```bash
git add app/components/WorkStatus.tsx
git commit -m "feat: WorkStatus accepts work hours via props"
```

---

### Task 11: SiteHeader из настроек

**Files:**
- Modify: `app/components/SiteHeader.tsx`

- [ ] **Step 1: Переписать SiteHeader как async-компонент**

Полный файл `app/components/SiteHeader.tsx`:
```tsx
import Image from "next/image";
import {
  buildContactLinks,
  mobileNavigationLinks,
  navigationLinks,
} from "../content/landing";
import { getSettings } from "../lib/queries";
import ContactIcon from "./ContactIcon";
import WorkStatus from "./WorkStatus";

export default async function SiteHeader() {
  const settings = await getSettings();
  const contactLinks = buildContactLinks(settings);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="На главный экран">
        <span className="brand-logo-shell" aria-hidden="true">
          <Image
            className="brand-logo"
            src="/logo/svm-logo-mark-cutout.png"
            alt=""
            width={96}
            height={96}
            priority
          />
        </span>
        <span>
          <strong>Кирпичные дома</strong>
          <small>Краснодар +70 км</small>
        </span>
      </a>

      <div className="header-proof" aria-label="Ключевая информация">
        <span className="header-claim" aria-label="Готовые дома. Строительство под заказ">
          <span>Готовые дома</span>
          <span>Строительство под заказ</span>
        </span>
      </div>

      <nav className="top-nav" aria-label="Основная навигация">
        {navigationLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <WorkStatus workStart={settings.work_start} workEnd={settings.work_end} />
        <div className="header-contact-buttons" aria-label="Быстрая связь">
          {contactLinks.map((link) => (
            <a
              className="header-contact-link"
              href={link.href}
              key={link.label}
              aria-label={link.label}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              <ContactIcon link={link} size={18} />
            </a>
          ))}
        </div>
        <a className="header-callback" href="#contacts">
          Обсудить проект
        </a>
      </div>

      <details className="mobile-menu">
        <summary aria-label="Открыть меню">
          <span />
          <span />
          <span />
        </summary>
        <nav className="mobile-menu-panel" aria-label="Мобильная навигация">
          {mobileNavigationLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
          <span className="mobile-work-status">
            <WorkStatus showHours workStart={settings.work_start} workEnd={settings.work_end} />
          </span>
          {contactLinks.map((link) => (
            <a
              className="mobile-menu-phone"
              href={link.href}
              key={link.label}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              <ContactIcon link={link} size={16} />
              {link.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}
```

- [ ] **Step 2: Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add app/components/SiteHeader.tsx
git commit -m "feat: SiteHeader reads contacts and hours from settings"
```

---

### Task 12: Секции читают данные из базы

**Files:**
- Modify: `app/components/landing/HomesSection.tsx`
- Modify: `app/components/landing/ProjectsSection.tsx`
- Modify: `app/components/landing/BuildingSection.tsx`
- Modify: `app/components/landing/PlotsSection.tsx`
- Modify: `app/components/landing/PricesSection.tsx`
- Modify: `app/components/landing/FaqSection.tsx`
- Modify: `app/components/landing/ContactsSection.tsx`

- [ ] **Step 1: HomesSection — async + запрос**

В `app/components/landing/HomesSection.tsx` заменить импорт и сигнатуру:
- Удалить строку `import { readyHomes } from "../../content/landing";`
- Добавить `import { getReadyHomes } from "../../lib/queries";`
- Заменить `export default function HomesSection() {` на:
```tsx
export default async function HomesSection() {
  const readyHomes = await getReadyHomes();
```
Остальная JSX без изменений.

- [ ] **Step 2: ProjectsSection — async + запрос**

В `app/components/landing/ProjectsSection.tsx`:
- Удалить `import { projects } from "../../content/landing";`
- Добавить `import { getProjects } from "../../lib/queries";`
- Заменить сигнатуру на:
```tsx
export default async function ProjectsSection() {
  const projects = await getProjects();
```

- [ ] **Step 3: BuildingSection — async + запрос**

В `app/components/landing/BuildingSection.tsx`:
- Удалить `import { buildingHomes } from "../../content/landing";`
- Добавить `import { getBuildingHomes } from "../../lib/queries";`
- Заменить сигнатуру на:
```tsx
export default async function BuildingSection() {
  const buildingHomes = await getBuildingHomes();
```

- [ ] **Step 4: PlotsSection — async + запрос**

В `app/components/landing/PlotsSection.tsx`:
- Удалить `import { plots } from "../../content/landing";`
- Добавить `import { getPlots } from "../../lib/queries";`
- Заменить сигнатуру на:
```tsx
export default async function PlotsSection() {
  const plots = await getPlots();
```

- [ ] **Step 5: PricesSection — async + запрос + заголовки пакетов из настроек**

Полный файл `app/components/landing/PricesSection.tsx`:
```tsx
import { getPriceRows, getSettings } from "../../lib/queries";

export default async function PricesSection() {
  const [priceRows, settings] = await Promise.all([getPriceRows(), getSettings()]);

  return (
    <section className="section" id="prices">
      <div className="container section-head">
        <span className="eyebrow">Комплектации и цены</span>
        <h2>
          Подробная <span className="text-accent">таблица комплектаций</span>
        </h2>
        <p>Сравните основные работы и выберите формат строительства под свой бюджет.</p>
      </div>
      <div className="container price-table-wrap">
        <table className="price-table">
          <thead>
            <tr>
              <th>Тип работ</th>
              <th>
                {settings.price_warm_label}
                <br />
                <strong>{settings.price_warm_value}</strong>
              </th>
              <th>
                {settings.price_pre_label}
                <br />
                <strong>{settings.price_pre_value}</strong>
              </th>
              <th>
                {settings.price_full_label}
                <br />
                <strong>{settings.price_full_value}</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row) => (
              <tr key={row.id}>
                <td>{row.work}</td>
                <td data-label={settings.price_warm_label}>{row.warm}</td>
                <td data-label={settings.price_pre_label}>{row.pre}</td>
                <td data-label={settings.price_full_label}>{row.full}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: FaqSection — async + запрос**

В `app/components/landing/FaqSection.tsx`:
- Удалить `import { faqItems } from "../../content/landing";`
- Добавить `import { getFaqItems } from "../../lib/queries";`
- Заменить сигнатуру на:
```tsx
export default async function FaqSection() {
  const faqItems = await getFaqItems();
```
- В `.map` заменить `key={item.question}` на `key={item.id}`.

- [ ] **Step 7: ContactsSection — async + контакты из настроек**

Полный файл `app/components/landing/ContactsSection.tsx`:
```tsx
import { ArrowRight } from "lucide-react";
import { buildContactLinks } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import ContactIcon from "../ContactIcon";
import WorkStatus from "../WorkStatus";

export default async function ContactsSection() {
  const settings = await getSettings();
  const contactLinks = buildContactLinks(settings);

  return (
    <section className="section contacts-section" id="contacts">
      <div className="container contacts-layout">
        <div>
          <span className="eyebrow">Контакты</span>
          <h2>Подберем дом, проект или участок под ваш бюджет</h2>
          <p>Оставьте телефон, и мы предложим ближайший вариант для просмотра или расчета.</p>
          <div className="contact-status-card">
            <WorkStatus showHours workStart={settings.work_start} workEnd={settings.work_end} />
          </div>
          <div className="contact-actions">
            {contactLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <ContactIcon link={link} size={18} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <form className="lead-form">
          <label>
            Имя
            <input type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" />
          </label>
          <label>
            Телефон
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+7 ___ ___-__-__"
            />
          </label>
          <label>
            Интересует
            <select defaultValue="ready-house">
              <option value="ready-house">Готовый дом</option>
              <option value="construction">Дом в строительстве</option>
              <option value="custom">Строительство под заказ</option>
              <option value="plot">Участок</option>
            </select>
          </label>
          <button className="button primary" type="button">
            Оставить заявку
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Проверка типов и сборка**

Run: `npx tsc --noEmit`
Expected: без ошибок.
Run: `npm run build`
Expected: сборка успешна (страница динамическая — ок).

- [ ] **Step 9: Браузерная проверка**

Запустить `npm run dev`, открыть `http://localhost:3000`. Убедиться: дома, проекты, дома в стройке, участки, цены, FAQ, контакты отображаются (данные из базы). Проверить, что цифры совпадают с прежними (5 домов, 7 проектов).

- [ ] **Step 10: Commit**

```bash
git add app/components
git commit -m "feat: public sections read content from database"
```

---

## Фаза C — Авторизация и оболочка админки

### Task 13: Сессия (jose) + тест

**Files:**
- Create: `app/lib/session.ts`
- Create: `app/lib/session.test.ts`

- [ ] **Step 1: Написать падающий тест**

`app/lib/session.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken } from "./session";

test("valid token round-trips and returns subject", async () => {
  const token = await createSessionToken("admin");
  const payload = await verifySessionToken(token);
  assert.equal(payload?.sub, "admin");
});

test("tampered token is rejected", async () => {
  const token = await createSessionToken("admin");
  const payload = await verifySessionToken(token + "x");
  assert.equal(payload, null);
});
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `AUTH_SECRET=test-secret-test-secret-test-secret npx tsx --test app/lib/session.test.ts`
(Windows PowerShell: `$env:AUTH_SECRET="test-secret-test-secret-test-secret"; npx tsx --test app/lib/session.test.ts`)
Expected: FAIL — модуль `./session` ещё не существует.

- [ ] **Step 3: Написать session.ts**

`app/lib/session.ts`:
```ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "admin_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
  return await new SignJWT({ sub: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run (PowerShell): `$env:AUTH_SECRET="test-secret-test-secret-test-secret"; npx tsx --test app/lib/session.test.ts`
Expected: PASS — оба теста зелёные.

- [ ] **Step 5: Commit**

```bash
git add app/lib/session.ts app/lib/session.test.ts
git commit -m "feat: add signed session token helper with tests"
```

---

### Task 14: Проверка логина (bcrypt)

**Files:**
- Create: `app/lib/auth.ts`

- [ ] **Step 1: Написать auth.ts**

`app/lib/auth.ts`:
```ts
import bcrypt from "bcryptjs";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (username !== process.env.ADMIN_USERNAME) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}
```

- [ ] **Step 2: Проверка типов и коммит**

Run: `npx tsc --noEmit`
Expected: без ошибок.
```bash
git add app/lib/auth.ts
git commit -m "feat: add credential verification"
```

---

### Task 15: Middleware защиты /admin

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Написать middleware.ts**

`middleware.ts` (в корне проекта):
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/app/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 3: Браузерная проверка редиректа**

`npm run dev`, открыть `http://localhost:3000/admin` → должно перебросить на `/admin/login`.

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: protect admin routes with middleware"
```

---

### Task 16: Стили админки

**Files:**
- Create: `app/admin/admin.css`

- [ ] **Step 1: Написать admin.css**

`app/admin/admin.css`:
```css
.admin-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: #f4f6fb;
  color: #11182f;
  font-family: "Segoe UI", Arial, sans-serif;
}
.admin-sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 14px;
  background: #11182f;
  color: #fff;
}
.admin-sidebar h1 { font-size: 16px; margin: 0 0 16px; }
.admin-sidebar a {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  font-size: 14px;
}
.admin-sidebar a:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.admin-main { padding: 28px 32px; }
.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.admin-card {
  background: #fff;
  border: 1px solid #e2e7f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(17, 24, 47, 0.05);
}
.admin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.admin-table th, .admin-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #eef1f6;
  text-align: left;
  vertical-align: middle;
}
.admin-table img { width: 64px; height: 44px; object-fit: cover; border-radius: 6px; }
.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #d3d9e6;
  border-radius: 8px;
  background: #fff;
  color: #11182f;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}
.admin-btn.primary { background: linear-gradient(135deg, #506ff0, #62c8c9); color: #fff; border: 0; }
.admin-btn.danger { color: #c0392b; border-color: #f0c5bf; }
.admin-btn:hover { transform: translateY(-1px); }
.admin-form { display: grid; gap: 14px; max-width: 640px; }
.admin-field { display: grid; gap: 6px; }
.admin-field label { font-size: 13px; font-weight: 600; color: #5a6478; }
.admin-field input, .admin-field textarea, .admin-field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d3d9e6;
  border-radius: 8px;
  font: inherit;
  background: #fff;
}
.admin-field textarea { min-height: 90px; resize: vertical; }
.admin-row-actions { display: inline-flex; gap: 8px; }
.admin-preview { width: 160px; height: 110px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e7f0; }
.admin-error { color: #c0392b; font-size: 14px; }
.admin-dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.admin-dash-card { display: block; text-decoration: none; }
.admin-dash-card strong { display: block; font-size: 28px; color: #506ff0; }
.admin-hidden-badge { font-size: 12px; color: #c0392b; font-weight: 600; }
.admin-login-wrap { display: grid; place-items: center; min-height: 100vh; background: #11182f; }
.admin-login-card { width: 320px; background: #fff; border-radius: 12px; padding: 28px; }
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/admin.css
git commit -m "feat: add admin styles"
```

---

### Task 17: Хелперы FormData

**Files:**
- Create: `app/lib/form.ts`

- [ ] **Step 1: Написать form.ts**

`app/lib/form.ts`:
```ts
export function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function num(formData: FormData, key: string): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

export function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}
```

- [ ] **Step 2: Commit**

```bash
git add app/lib/form.ts
git commit -m "feat: add FormData helpers"
```

---

### Task 18: Загрузка фото

**Files:**
- Create: `app/lib/upload.ts`

- [ ] **Step 1: Написать upload.ts**

`app/lib/upload.ts`:
```ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUploadedImage(
  file: File | null,
  existingPath: string,
): Promise<string> {
  if (!file || file.size === 0) {
    return existingPath;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);

  return `/uploads/${fileName}`;
}
```

- [ ] **Step 2: Разрешить локальные uploads в next/image (не требуется — локальные пути работают без настройки). Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add app/lib/upload.ts
git commit -m "feat: add image upload helper"
```

---

### Task 19: Общие компоненты админки

**Files:**
- Create: `app/admin/components/DeleteButton.tsx`
- Create: `app/admin/components/RowActions.tsx`

- [ ] **Step 1: DeleteButton (клиентский, с подтверждением)**

`app/admin/components/DeleteButton.tsx`:
```tsx
"use client";

type DeleteButtonProps = {
  action: (formData: FormData) => void;
  id: string;
  label?: string;
};

export default function DeleteButton({ action, id, label = "Удалить" }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Удалить запись? Действие необратимо.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="admin-btn danger" type="submit">
        {label}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: RowActions (переключение видимости + порядок + удаление)**

`app/admin/components/RowActions.tsx`:
```tsx
import Link from "next/link";
import DeleteButton from "./DeleteButton";

type RowActionsProps = {
  editHref: string;
  id: string;
  isVisible?: boolean;
  toggleAction?: (formData: FormData) => void;
  moveAction?: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
};

export default function RowActions({
  editHref,
  id,
  isVisible,
  toggleAction,
  moveAction,
  deleteAction,
}: RowActionsProps) {
  return (
    <div className="admin-row-actions">
      <Link className="admin-btn" href={editHref}>
        Редактировать
      </Link>
      {moveAction && (
        <>
          <form action={moveAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value="up" />
            <button className="admin-btn" type="submit" aria-label="Выше">↑</button>
          </form>
          <form action={moveAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value="down" />
            <button className="admin-btn" type="submit" aria-label="Ниже">↓</button>
          </form>
        </>
      )}
      {toggleAction && (
        <form action={toggleAction}>
          <input type="hidden" name="id" value={id} />
          <button className="admin-btn" type="submit">
            {isVisible ? "Скрыть" : "Показать"}
          </button>
        </form>
      )}
      <DeleteButton action={deleteAction} id={id} />
    </div>
  );
}
```

- [ ] **Step 3: Проверка типов и коммит**

Run: `npx tsc --noEmit`
Expected: без ошибок.
```bash
git add app/admin/components
git commit -m "feat: add shared admin row components"
```

---

### Task 20: Вход и выход

**Files:**
- Create: `app/admin/login/actions.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/logout/actions.ts`

- [ ] **Step 1: login actions**

`app/admin/login/actions.ts`:
```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "@/app/lib/auth";
import { createSessionToken, SESSION_COOKIE } from "@/app/lib/session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const ok = await verifyCredentials(username, password);
  if (!ok) {
    return { error: "Неверный логин или пароль" };
  }

  const token = await createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}
```

- [ ] **Step 2: login page**

`app/admin/login/page.tsx`:
```tsx
"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card admin-form" action={action}>
        <h1>Вход в админку</h1>
        <div className="admin-field">
          <label htmlFor="username">Логин</label>
          <input id="username" name="username" type="text" autoComplete="username" required />
        </div>
        <div className="admin-field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state.error && <p className="admin-error">{state.error}</p>}
        <button className="admin-btn primary" type="submit" disabled={pending}>
          {pending ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: logout action**

`app/admin/logout/actions.ts`:
```ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/app/lib/session";

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
```

- [ ] **Step 4: Проверка типов**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 5: Браузерная проверка входа**

`npm run dev`, открыть `/admin` → редирект на `/admin/login`. Ввести логин `admin` и пароль `admin123` → попадание на `/admin` (страница появится в следующей задаче; пока может быть 404 — это ок, главное что cookie ставится и нет редиректа обратно на login). Проверить неверный пароль → сообщение об ошибке.

- [ ] **Step 6: Commit**

```bash
git add app/admin/login app/admin/logout
git commit -m "feat: add admin login and logout"
```

---

### Task 21: Оболочка и дашборд

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Layout админки**

`app/admin/layout.tsx`:
```tsx
import Link from "next/link";
import "./admin.css";
import { logout } from "./logout/actions";

const sections = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/homes", label: "Готовые дома" },
  { href: "/admin/building", label: "Дома в строительстве" },
  { href: "/admin/projects", label: "Проекты" },
  { href: "/admin/plots", label: "Участки" },
  { href: "/admin/prices", label: "Цены и комплектации" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/settings", label: "Настройки сайта" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h1>Админка сайта</h1>
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            {s.label}
          </Link>
        ))}
        <form action={logout} style={{ marginTop: "auto", paddingTop: 16 }}>
          <button className="admin-btn" type="submit">Выйти</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
```
Примечание: `/admin/login` имеет собственную разметку (центрированная карточка), но тоже попадёт в этот layout. Это допустимо — форма отрисуется по центру внутри `.admin-main`. Если визуально мешает рамка меню на странице логина, в `Task 20` страница уже использует `.admin-login-wrap` с фиксированной высотой; меню будет слева. Для чистоты можно вынести login в route-группу без layout — **необязательно для MVP**.

- [ ] **Step 2: Дашборд со счётчиками**

`app/admin/page.tsx`:
```tsx
import Link from "next/link";
import { prisma } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [homes, building, projects, plots, prices, faq] = await Promise.all([
    prisma.readyHome.count(),
    prisma.buildingHome.count(),
    prisma.project.count(),
    prisma.plot.count(),
    prisma.priceRow.count(),
    prisma.faqItem.count(),
  ]);

  const cards = [
    { href: "/admin/homes", label: "Готовые дома", value: homes },
    { href: "/admin/building", label: "Дома в строительстве", value: building },
    { href: "/admin/projects", label: "Проекты", value: projects },
    { href: "/admin/plots", label: "Участки", value: plots },
    { href: "/admin/prices", label: "Строк в таблице цен", value: prices },
    { href: "/admin/faq", label: "Вопросов в FAQ", value: faq },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h2>Дашборд</h2>
      </div>
      <div className="admin-dashboard-grid">
        {cards.map((c) => (
          <Link key={c.href} className="admin-card admin-dash-card" href={c.href}>
            <strong>{c.value}</strong>
            {c.label}
          </Link>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Браузерная проверка**

`npm run dev`, войти, открыть `/admin` → видны карточки со счётчиками (Готовые дома: 5, Проекты: 7 и т.д.). Меню слева работает.

- [ ] **Step 4: Commit**

```bash
git add app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat: add admin shell and dashboard"
```

---

## Фаза D — CRUD по разделам

> Паттерн один и тот же: `actions.ts` (Server Actions) + `page.tsx` (список) + `new/page.tsx` + `[id]/page.tsx` (форма). Ниже для каждого раздела дан полный код.

### Task 22: Готовые дома (эталонный раздел, с фото)

**Files:**
- Create: `app/admin/homes/actions.ts`
- Create: `app/admin/homes/HomeForm.tsx`
- Create: `app/admin/homes/page.tsx`
- Create: `app/admin/homes/new/page.tsx`
- Create: `app/admin/homes/[id]/page.tsx`

- [ ] **Step 1: actions.ts**

`app/admin/homes/actions.ts`:
```ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/homes");
}

async function readData(formData: FormData) {
  const image = await saveUploadedImage(
    formData.get("imageFile") as File | null,
    str(formData, "imageExisting"),
  );
  return {
    title: str(formData, "title"),
    price: str(formData, "price"),
    area: str(formData, "area"),
    land: str(formData, "land"),
    rooms: str(formData, "rooms"),
    baths: str(formData, "baths"),
    location: str(formData, "location"),
    status: str(formData, "status"),
    image,
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createHome(formData: FormData) {
  await prisma.readyHome.create({ data: await readData(formData) });
  revalidate();
  redirect("/admin/homes");
}

export async function updateHome(formData: FormData) {
  const id = str(formData, "id");
  await prisma.readyHome.update({ where: { id }, data: await readData(formData) });
  revalidate();
  redirect("/admin/homes");
}

export async function deleteHome(formData: FormData) {
  await prisma.readyHome.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function toggleHome(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.readyHome.findUnique({ where: { id } });
  if (current) {
    await prisma.readyHome.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}
```

- [ ] **Step 2: HomeForm.tsx (форма создания и редактирования)**

`app/admin/homes/HomeForm.tsx`:
```tsx
import Image from "next/image";
import type { ReadyHome } from "@prisma/client";

type HomeFormProps = {
  action: (formData: FormData) => void;
  home?: ReadyHome;
};

export default function HomeForm({ action, home }: HomeFormProps) {
  return (
    <form className="admin-form" action={action} encType="multipart/form-data">
      {home && <input type="hidden" name="id" value={home.id} />}
      <input type="hidden" name="imageExisting" value={home?.image ?? ""} />

      <div className="admin-field">
        <label>Название</label>
        <input name="title" defaultValue={home?.title ?? ""} required />
      </div>
      <div className="admin-field">
        <label>Цена</label>
        <input name="price" defaultValue={home?.price ?? ""} placeholder="от 12,8 млн ₽" />
      </div>
      <div className="admin-field">
        <label>Площадь дома</label>
        <input name="area" defaultValue={home?.area ?? ""} placeholder="126 м²" />
      </div>
      <div className="admin-field">
        <label>Площадь участка</label>
        <input name="land" defaultValue={home?.land ?? ""} placeholder="5,6 сот." />
      </div>
      <div className="admin-field">
        <label>Комнаты</label>
        <input name="rooms" defaultValue={home?.rooms ?? ""} placeholder="4 комнаты" />
      </div>
      <div className="admin-field">
        <label>Санузлы</label>
        <input name="baths" defaultValue={home?.baths ?? ""} placeholder="2 санузла" />
      </div>
      <div className="admin-field">
        <label>Локация</label>
        <input name="location" defaultValue={home?.location ?? ""} />
      </div>
      <div className="admin-field">
        <label>Статус</label>
        <input name="status" defaultValue={home?.status ?? ""} placeholder="готов к просмотру" />
      </div>
      <div className="admin-field">
        <label>Фото</label>
        {home?.image && (
          <Image className="admin-preview" src={home.image} alt="" width={160} height={110} />
        )}
        <input name="imageFile" type="file" accept="image/*" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={home?.sortOrder ?? 0} />
      </div>
      <div className="admin-field">
        <label>
          <input name="isVisible" type="checkbox" defaultChecked={home?.isVisible ?? true} /> Показывать на сайте
        </label>
      </div>
      <button className="admin-btn primary" type="submit">Сохранить</button>
    </form>
  );
}
```
Примечание: `next/image` с локальным путём из `public/uploads` работает; для внешних Unsplash-URL домен уже разрешён в `next.config.ts`.

- [ ] **Step 3: Список homes/page.tsx**

`app/admin/homes/page.tsx`:
```tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deleteHome, toggleHome } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomesAdmin() {
  const homes = await prisma.readyHome.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Готовые дома</h2>
        <Link className="admin-btn primary" href="/admin/homes/new">Добавить дом</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Фото</th><th>Название</th><th>Цена</th><th>Статус</th><th></th></tr>
          </thead>
          <tbody>
            {homes.map((home) => (
              <tr key={home.id}>
                <td>{home.image && <Image src={home.image} alt="" width={64} height={44} />}</td>
                <td>
                  {home.title}
                  {!home.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{home.price}</td>
                <td>{home.status}</td>
                <td>
                  <RowActions
                    editHref={`/admin/homes/${home.id}`}
                    id={home.id}
                    isVisible={home.isVisible}
                    toggleAction={toggleHome}
                    deleteAction={deleteHome}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Создание homes/new/page.tsx**

`app/admin/homes/new/page.tsx`:
```tsx
import HomeForm from "../HomeForm";
import { createHome } from "../actions";

export default function NewHome() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый дом</h2></div>
      <div className="admin-card">
        <HomeForm action={createHome} />
      </div>
    </>
  );
}
```

- [ ] **Step 5: Редактирование homes/[id]/page.tsx**

`app/admin/homes/[id]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import HomeForm from "../HomeForm";
import { updateHome } from "../actions";

export default async function EditHome({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const home = await prisma.readyHome.findUnique({ where: { id } });
  if (!home) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование дома</h2></div>
      <div className="admin-card">
        <HomeForm action={updateHome} home={home} />
      </div>
    </>
  );
}
```

- [ ] **Step 6: Проверка типов и сборка**

Run: `npx tsc --noEmit`
Expected: без ошибок.

- [ ] **Step 7: Браузерная проверка полного цикла**

`npm run dev`, войти. `/admin/homes`: список из 5 домов. Добавить дом с фото → появляется в списке и на сайте (`/` раздел «Готовые дома»). Отредактировать, заменить фото. Скрыть → пропадает с сайта, в списке помечен «скрыто». Удалить (с подтверждением). Проверить, что главная страница обновляется (revalidate).

- [ ] **Step 8: Commit**

```bash
git add app/admin/homes
git commit -m "feat: admin CRUD for ready homes with image upload"
```

---

### Task 23: Проекты (с фото)

**Files:**
- Create: `app/admin/projects/actions.ts`
- Create: `app/admin/projects/ProjectForm.tsx`
- Create: `app/admin/projects/page.tsx`
- Create: `app/admin/projects/new/page.tsx`
- Create: `app/admin/projects/[id]/page.tsx`

- [ ] **Step 1: actions.ts**

`app/admin/projects/actions.ts`:
```ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

async function readData(formData: FormData) {
  const image = await saveUploadedImage(
    formData.get("imageFile") as File | null,
    str(formData, "imageExisting"),
  );
  return {
    name: str(formData, "name"),
    area: str(formData, "area"),
    floors: str(formData, "floors"),
    price: str(formData, "price"),
    time: str(formData, "time"),
    tag: str(formData, "tag"),
    description: str(formData, "description"),
    image,
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createProject(formData: FormData) {
  await prisma.project.create({ data: await readData(formData) });
  revalidate();
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData) {
  await prisma.project.update({ where: { id: str(formData, "id") }, data: await readData(formData) });
  revalidate();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await prisma.project.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function toggleProject(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.project.findUnique({ where: { id } });
  if (current) {
    await prisma.project.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}
```

- [ ] **Step 2: ProjectForm.tsx**

`app/admin/projects/ProjectForm.tsx`:
```tsx
import Image from "next/image";
import type { Project } from "@prisma/client";

type ProjectFormProps = {
  action: (formData: FormData) => void;
  project?: Project;
};

export default function ProjectForm({ action, project }: ProjectFormProps) {
  return (
    <form className="admin-form" action={action} encType="multipart/form-data">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="imageExisting" value={project?.image ?? ""} />

      <div className="admin-field">
        <label>Название</label>
        <input name="name" defaultValue={project?.name ?? ""} required />
      </div>
      <div className="admin-field">
        <label>Площадь</label>
        <input name="area" defaultValue={project?.area ?? ""} placeholder="104 м²" />
      </div>
      <div className="admin-field">
        <label>Этажность</label>
        <input name="floors" defaultValue={project?.floors ?? ""} placeholder="1 этаж" />
      </div>
      <div className="admin-field">
        <label>Цена</label>
        <input name="price" defaultValue={project?.price ?? ""} placeholder="от 7,1 млн ₽" />
      </div>
      <div className="admin-field">
        <label>Срок</label>
        <input name="time" defaultValue={project?.time ?? ""} placeholder="5 месяцев" />
      </div>
      <div className="admin-field">
        <label>Тег</label>
        <input name="tag" defaultValue={project?.tag ?? ""} placeholder="Готовый семейный формат" />
      </div>
      <div className="admin-field">
        <label>Описание</label>
        <textarea name="description" defaultValue={project?.description ?? ""} />
      </div>
      <div className="admin-field">
        <label>Фото</label>
        {project?.image && (
          <Image className="admin-preview" src={project.image} alt="" width={160} height={110} />
        )}
        <input name="imageFile" type="file" accept="image/*" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} />
      </div>
      <div className="admin-field">
        <label>
          <input name="isVisible" type="checkbox" defaultChecked={project?.isVisible ?? true} /> Показывать на сайте
        </label>
      </div>
      <button className="admin-btn primary" type="submit">Сохранить</button>
    </form>
  );
}
```

- [ ] **Step 3: page.tsx (список)**

`app/admin/projects/page.tsx`:
```tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deleteProject, toggleProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Проекты</h2>
        <Link className="admin-btn primary" href="/admin/projects/new">Добавить проект</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Фото</th><th>Название</th><th>Площадь</th><th>Цена</th><th></th></tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.image && <Image src={project.image} alt="" width={64} height={44} />}</td>
                <td>
                  {project.name}
                  {!project.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{project.area}</td>
                <td>{project.price}</td>
                <td>
                  <RowActions
                    editHref={`/admin/projects/${project.id}`}
                    id={project.id}
                    isVisible={project.isVisible}
                    toggleAction={toggleProject}
                    deleteAction={deleteProject}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

- [ ] **Step 4: new/page.tsx**

`app/admin/projects/new/page.tsx`:
```tsx
import ProjectForm from "../ProjectForm";
import { createProject } from "../actions";

export default function NewProject() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый проект</h2></div>
      <div className="admin-card">
        <ProjectForm action={createProject} />
      </div>
    </>
  );
}
```

- [ ] **Step 5: [id]/page.tsx**

`app/admin/projects/[id]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import ProjectForm from "../ProjectForm";
import { updateProject } from "../actions";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование проекта</h2></div>
      <div className="admin-card">
        <ProjectForm action={updateProject} project={project} />
      </div>
    </>
  );
}
```

- [ ] **Step 6: Проверка и коммит**

Run: `npx tsc --noEmit`
Expected: без ошибок.
Браузер: добавить/изменить/скрыть/удалить проект, проверить сайт.
```bash
git add app/admin/projects
git commit -m "feat: admin CRUD for projects with image upload"
```

---

### Task 24: Дома в строительстве

**Files:**
- Create: `app/admin/building/actions.ts`
- Create: `app/admin/building/BuildingForm.tsx`
- Create: `app/admin/building/page.tsx`
- Create: `app/admin/building/new/page.tsx`
- Create: `app/admin/building/[id]/page.tsx`

- [ ] **Step 1: actions.ts**

`app/admin/building/actions.ts`:
```ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/building");
}

function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    stage: str(formData, "stage"),
    finish: str(formData, "finish"),
    location: str(formData, "location"),
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createBuilding(formData: FormData) {
  await prisma.buildingHome.create({ data: readData(formData) });
  revalidate();
  redirect("/admin/building");
}

export async function updateBuilding(formData: FormData) {
  await prisma.buildingHome.update({ where: { id: str(formData, "id") }, data: readData(formData) });
  revalidate();
  redirect("/admin/building");
}

export async function deleteBuilding(formData: FormData) {
  await prisma.buildingHome.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function toggleBuilding(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.buildingHome.findUnique({ where: { id } });
  if (current) {
    await prisma.buildingHome.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}
```

- [ ] **Step 2: BuildingForm.tsx**

`app/admin/building/BuildingForm.tsx`:
```tsx
import type { BuildingHome } from "@prisma/client";

type BuildingFormProps = {
  action: (formData: FormData) => void;
  item?: BuildingHome;
};

export default function BuildingForm({ action, item }: BuildingFormProps) {
  return (
    <form className="admin-form" action={action}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="admin-field">
        <label>Название</label>
        <input name="title" defaultValue={item?.title ?? ""} placeholder="Дом 118 м²" required />
      </div>
      <div className="admin-field">
        <label>Этап</label>
        <input name="stage" defaultValue={item?.stage ?? ""} placeholder="коробка готова" />
      </div>
      <div className="admin-field">
        <label>Срок сдачи</label>
        <input name="finish" defaultValue={item?.finish ?? ""} placeholder="сдача в августе" />
      </div>
      <div className="admin-field">
        <label>Локация</label>
        <input name="location" defaultValue={item?.location ?? ""} placeholder="Краснодар +30 км" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
      </div>
      <div className="admin-field">
        <label>
          <input name="isVisible" type="checkbox" defaultChecked={item?.isVisible ?? true} /> Показывать на сайте
        </label>
      </div>
      <button className="admin-btn primary" type="submit">Сохранить</button>
    </form>
  );
}
```

- [ ] **Step 3: page.tsx (список)**

`app/admin/building/page.tsx`:
```tsx
import Link from "next/link";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deleteBuilding, toggleBuilding } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuildingAdmin() {
  const items = await prisma.buildingHome.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Дома в строительстве</h2>
        <Link className="admin-btn primary" href="/admin/building/new">Добавить</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Название</th><th>Этап</th><th>Срок</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.title}
                  {!item.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{item.stage}</td>
                <td>{item.finish}</td>
                <td>
                  <RowActions
                    editHref={`/admin/building/${item.id}`}
                    id={item.id}
                    isVisible={item.isVisible}
                    toggleAction={toggleBuilding}
                    deleteAction={deleteBuilding}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

- [ ] **Step 4: new/page.tsx**

`app/admin/building/new/page.tsx`:
```tsx
import BuildingForm from "../BuildingForm";
import { createBuilding } from "../actions";

export default function NewBuilding() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый объект</h2></div>
      <div className="admin-card">
        <BuildingForm action={createBuilding} />
      </div>
    </>
  );
}
```

- [ ] **Step 5: [id]/page.tsx**

`app/admin/building/[id]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import BuildingForm from "../BuildingForm";
import { updateBuilding } from "../actions";

export default async function EditBuilding({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.buildingHome.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование объекта</h2></div>
      <div className="admin-card">
        <BuildingForm action={updateBuilding} item={item} />
      </div>
    </>
  );
}
```

- [ ] **Step 6: Проверка и коммит**

Run: `npx tsc --noEmit`
Браузер: цикл CRUD + проверка сайта.
```bash
git add app/admin/building
git commit -m "feat: admin CRUD for building homes"
```

---

### Task 25: Участки

**Files:**
- Create: `app/admin/plots/actions.ts`
- Create: `app/admin/plots/PlotForm.tsx`
- Create: `app/admin/plots/page.tsx`
- Create: `app/admin/plots/new/page.tsx`
- Create: `app/admin/plots/[id]/page.tsx`

- [ ] **Step 1: actions.ts**

`app/admin/plots/actions.ts`:
```ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/plots");
}

function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    area: str(formData, "area"),
    utilities: str(formData, "utilities"),
    location: str(formData, "location"),
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createPlot(formData: FormData) {
  await prisma.plot.create({ data: readData(formData) });
  revalidate();
  redirect("/admin/plots");
}

export async function updatePlot(formData: FormData) {
  await prisma.plot.update({ where: { id: str(formData, "id") }, data: readData(formData) });
  revalidate();
  redirect("/admin/plots");
}

export async function deletePlot(formData: FormData) {
  await prisma.plot.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function togglePlot(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.plot.findUnique({ where: { id } });
  if (current) {
    await prisma.plot.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}
```

- [ ] **Step 2: PlotForm.tsx**

`app/admin/plots/PlotForm.tsx`:
```tsx
import type { Plot } from "@prisma/client";

type PlotFormProps = {
  action: (formData: FormData) => void;
  plot?: Plot;
};

export default function PlotForm({ action, plot }: PlotFormProps) {
  return (
    <form className="admin-form" action={action}>
      {plot && <input type="hidden" name="id" value={plot.id} />}
      <div className="admin-field">
        <label>Название</label>
        <input name="title" defaultValue={plot?.title ?? ""} placeholder="Участок под дом 104 м²" required />
      </div>
      <div className="admin-field">
        <label>Площадь</label>
        <input name="area" defaultValue={plot?.area ?? ""} placeholder="5 сот." />
      </div>
      <div className="admin-field">
        <label>Коммуникации</label>
        <input name="utilities" defaultValue={plot?.utilities ?? ""} placeholder="свет, вода рядом" />
      </div>
      <div className="admin-field">
        <label>Локация</label>
        <input name="location" defaultValue={plot?.location ?? ""} placeholder="Краснодар +20 км" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={plot?.sortOrder ?? 0} />
      </div>
      <div className="admin-field">
        <label>
          <input name="isVisible" type="checkbox" defaultChecked={plot?.isVisible ?? true} /> Показывать на сайте
        </label>
      </div>
      <button className="admin-btn primary" type="submit">Сохранить</button>
    </form>
  );
}
```

- [ ] **Step 3: page.tsx (список)**

`app/admin/plots/page.tsx`:
```tsx
import Link from "next/link";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deletePlot, togglePlot } from "./actions";

export const dynamic = "force-dynamic";

export default async function PlotsAdmin() {
  const plots = await prisma.plot.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Участки</h2>
        <Link className="admin-btn primary" href="/admin/plots/new">Добавить участок</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Название</th><th>Площадь</th><th>Локация</th><th></th></tr>
          </thead>
          <tbody>
            {plots.map((plot) => (
              <tr key={plot.id}>
                <td>
                  {plot.title}
                  {!plot.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{plot.area}</td>
                <td>{plot.location}</td>
                <td>
                  <RowActions
                    editHref={`/admin/plots/${plot.id}`}
                    id={plot.id}
                    isVisible={plot.isVisible}
                    toggleAction={togglePlot}
                    deleteAction={deletePlot}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```

- [ ] **Step 4: new/page.tsx**

`app/admin/plots/new/page.tsx`:
```tsx
import PlotForm from "../PlotForm";
import { createPlot } from "../actions";

export default function NewPlot() {
  return (
    <>
      <div className="admin-topbar"><h2>Новый участок</h2></div>
      <div className="admin-card">
        <PlotForm action={createPlot} />
      </div>
    </>
  );
}
```

- [ ] **Step 5: [id]/page.tsx**

`app/admin/plots/[id]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import PlotForm from "../PlotForm";
import { updatePlot } from "../actions";

export default async function EditPlot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plot = await prisma.plot.findUnique({ where: { id } });
  if (!plot) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование участка</h2></div>
      <div className="admin-card">
        <PlotForm action={updatePlot} plot={plot} />
      </div>
    </>
  );
}
```

- [ ] **Step 6: Проверка и коммит**

Run: `npx tsc --noEmit`
Браузер: цикл CRUD + сайт.
```bash
git add app/admin/plots
git commit -m "feat: admin CRUD for plots"
```

---

### Task 26: Цены и комплектации

**Files:**
- Create: `app/admin/prices/actions.ts`
- Create: `app/admin/prices/page.tsx`

- [ ] **Step 1: actions.ts (строки + заголовки пакетов в настройках)**

`app/admin/prices/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/prices");
}

export async function createRow(formData: FormData) {
  const count = await prisma.priceRow.count();
  await prisma.priceRow.create({
    data: {
      work: str(formData, "work"),
      warm: str(formData, "warm"),
      pre: str(formData, "pre"),
      full: str(formData, "full"),
      sortOrder: count,
    },
  });
  revalidate();
}

export async function updateRow(formData: FormData) {
  await prisma.priceRow.update({
    where: { id: str(formData, "id") },
    data: {
      work: str(formData, "work"),
      warm: str(formData, "warm"),
      pre: str(formData, "pre"),
      full: str(formData, "full"),
      sortOrder: num(formData, "sortOrder"),
    },
  });
  revalidate();
}

export async function deleteRow(formData: FormData) {
  await prisma.priceRow.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

const PACKAGE_KEYS = [
  "price_warm_label",
  "price_warm_value",
  "price_pre_label",
  "price_pre_value",
  "price_full_label",
  "price_full_value",
];

export async function updatePackages(formData: FormData) {
  for (const key of PACKAGE_KEYS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: str(formData, key) },
      create: { key, value: str(formData, key) },
    });
  }
  revalidate();
}
```

- [ ] **Step 2: page.tsx (заголовки пакетов + таблица строк + добавление строки)**

`app/admin/prices/page.tsx`:
```tsx
import { prisma } from "@/app/lib/db";
import DeleteButton from "@/app/admin/components/DeleteButton";
import { createRow, updateRow, deleteRow, updatePackages } from "./actions";

export const dynamic = "force-dynamic";

export default async function PricesAdmin() {
  const [rows, settingsRows] = await Promise.all([
    prisma.priceRow.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);
  const s = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));

  return (
    <>
      <div className="admin-topbar"><h2>Цены и комплектации</h2></div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Заголовки пакетов</h3>
        <form className="admin-form" action={updatePackages}>
          <div className="admin-field">
            <label>Пакет 1 — название</label>
            <input name="price_warm_label" defaultValue={s.price_warm_label ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 1 — цена</label>
            <input name="price_warm_value" defaultValue={s.price_warm_value ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 2 — название</label>
            <input name="price_pre_label" defaultValue={s.price_pre_label ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 2 — цена</label>
            <input name="price_pre_value" defaultValue={s.price_pre_value ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 3 — название</label>
            <input name="price_full_label" defaultValue={s.price_full_label ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 3 — цена</label>
            <input name="price_full_value" defaultValue={s.price_full_value ?? ""} />
          </div>
          <button className="admin-btn primary" type="submit">Сохранить заголовки</button>
        </form>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Строки таблицы</h3>
        <table className="admin-table">
          <thead>
            <tr><th>Работа</th><th>Пакет 1</th><th>Пакет 2</th><th>Пакет 3</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td colSpan={5}>
                  <form className="admin-form" action={updateRow} style={{ maxWidth: "none" }}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="sortOrder" value={row.sortOrder} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) auto auto", gap: 8, alignItems: "center" }}>
                      <input name="work" defaultValue={row.work} />
                      <input name="warm" defaultValue={row.warm} />
                      <input name="pre" defaultValue={row.pre} />
                      <input name="full" defaultValue={row.full} />
                      <button className="admin-btn" type="submit">Сохранить</button>
                    </div>
                  </form>
                  <div style={{ marginTop: 6 }}>
                    <DeleteButton action={deleteRow} id={row.id} label="Удалить строку" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Добавить строку</h3>
        <form className="admin-form" action={createRow}>
          <div className="admin-field"><label>Работа</label><input name="work" required /></div>
          <div className="admin-field"><label>Пакет 1</label><input name="warm" /></div>
          <div className="admin-field"><label>Пакет 2</label><input name="pre" /></div>
          <div className="admin-field"><label>Пакет 3</label><input name="full" /></div>
          <button className="admin-btn primary" type="submit">Добавить</button>
        </form>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Проверка и коммит**

Run: `npx tsc --noEmit`
Браузер: изменить заголовки пакетов и строку → проверить таблицу цен на сайте. Добавить/удалить строку.
```bash
git add app/admin/prices
git commit -m "feat: admin editing for price table and packages"
```

---

### Task 27: FAQ

**Files:**
- Create: `app/admin/faq/actions.ts`
- Create: `app/admin/faq/page.tsx`

- [ ] **Step 1: actions.ts**

`app/admin/faq/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function createFaq(formData: FormData) {
  const count = await prisma.faqItem.count();
  await prisma.faqItem.create({
    data: { question: str(formData, "question"), answer: str(formData, "answer"), sortOrder: count },
  });
  revalidate();
}

export async function updateFaq(formData: FormData) {
  await prisma.faqItem.update({
    where: { id: str(formData, "id") },
    data: {
      question: str(formData, "question"),
      answer: str(formData, "answer"),
      sortOrder: num(formData, "sortOrder"),
    },
  });
  revalidate();
}

export async function deleteFaq(formData: FormData) {
  await prisma.faqItem.delete({ where: { id: str(formData, "id") } });
  revalidate();
}
```

- [ ] **Step 2: page.tsx**

`app/admin/faq/page.tsx`:
```tsx
import { prisma } from "@/app/lib/db";
import DeleteButton from "@/app/admin/components/DeleteButton";
import { createFaq, updateFaq, deleteFaq } from "./actions";

export const dynamic = "force-dynamic";

export default async function FaqAdmin() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar"><h2>FAQ</h2></div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Вопросы</h3>
        {items.map((item) => (
          <form key={item.id} className="admin-form" action={updateFaq} style={{ marginBottom: 16 }}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="sortOrder" value={item.sortOrder} />
            <div className="admin-field">
              <label>Вопрос</label>
              <input name="question" defaultValue={item.question} />
            </div>
            <div className="admin-field">
              <label>Ответ</label>
              <textarea name="answer" defaultValue={item.answer} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="admin-btn primary" type="submit">Сохранить</button>
              <DeleteButton action={deleteFaq} id={item.id} label="Удалить" />
            </div>
          </form>
        ))}
      </div>

      <div className="admin-card">
        <h3>Добавить вопрос</h3>
        <form className="admin-form" action={createFaq}>
          <div className="admin-field"><label>Вопрос</label><input name="question" required /></div>
          <div className="admin-field"><label>Ответ</label><textarea name="answer" required /></div>
          <button className="admin-btn primary" type="submit">Добавить</button>
        </form>
      </div>
    </>
  );
}
```
Примечание: `DeleteButton` находится внутри формы редактирования, но сам рендерит вложенную `<form>` — это невалидно (вложенные формы). Чтобы избежать, в этом разделе вынести удаление в отдельную форму НЕ внутри формы обновления: размести `DeleteButton` рядом, вне `<form action={updateFaq}>`. Исправленный фрагмент: закрыть форму обновления до кнопки удаления.

- [ ] **Step 3: Исправить вложенность форм (вынести удаление наружу)**

Заменить тело `items.map(...)` в `app/admin/faq/page.tsx` на:
```tsx
        {items.map((item) => (
          <div key={item.id} style={{ marginBottom: 16, borderBottom: "1px solid #eef1f6", paddingBottom: 16 }}>
            <form className="admin-form" action={updateFaq}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="sortOrder" value={item.sortOrder} />
              <div className="admin-field">
                <label>Вопрос</label>
                <input name="question" defaultValue={item.question} />
              </div>
              <div className="admin-field">
                <label>Ответ</label>
                <textarea name="answer" defaultValue={item.answer} />
              </div>
              <button className="admin-btn primary" type="submit">Сохранить</button>
            </form>
            <div style={{ marginTop: 8 }}>
              <DeleteButton action={deleteFaq} id={item.id} label="Удалить" />
            </div>
          </div>
        ))}
```

- [ ] **Step 4: Проверка и коммит**

Run: `npx tsc --noEmit`
Браузер: добавить/изменить/удалить вопрос → проверить FAQ на сайте.
```bash
git add app/admin/faq
git commit -m "feat: admin editing for FAQ"
```

---

### Task 28: Настройки сайта

**Files:**
- Create: `app/admin/settings/actions.ts`
- Create: `app/admin/settings/page.tsx`

- [ ] **Step 1: actions.ts**

`app/admin/settings/actions.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";

const KEYS = [
  "phone",
  "whatsapp_url",
  "telegram_url",
  "max_url",
  "work_start",
  "work_end",
  "seo_title",
  "seo_description",
];

export async function updateSettings(formData: FormData) {
  for (const key of KEYS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: str(formData, key) },
      create: { key, value: str(formData, key) },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
```

- [ ] **Step 2: page.tsx**

`app/admin/settings/page.tsx`:
```tsx
import { prisma } from "@/app/lib/db";
import { updateSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  const rows = await prisma.siteSetting.findMany();
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <>
      <div className="admin-topbar"><h2>Настройки сайта</h2></div>
      <div className="admin-card">
        <form className="admin-form" action={updateSettings}>
          <div className="admin-field"><label>Телефон</label><input name="phone" defaultValue={s.phone ?? ""} placeholder="+79990000000" /></div>
          <div className="admin-field"><label>WhatsApp (ссылка)</label><input name="whatsapp_url" defaultValue={s.whatsapp_url ?? ""} /></div>
          <div className="admin-field"><label>Telegram (ссылка)</label><input name="telegram_url" defaultValue={s.telegram_url ?? ""} /></div>
          <div className="admin-field"><label>MAX (ссылка)</label><input name="max_url" defaultValue={s.max_url ?? ""} /></div>
          <div className="admin-field"><label>Начало работы (ЧЧ:ММ)</label><input name="work_start" defaultValue={s.work_start ?? "08:00"} /></div>
          <div className="admin-field"><label>Конец работы (ЧЧ:ММ)</label><input name="work_end" defaultValue={s.work_end ?? "19:00"} /></div>
          <div className="admin-field"><label>SEO title</label><input name="seo_title" defaultValue={s.seo_title ?? ""} /></div>
          <div className="admin-field"><label>SEO description</label><textarea name="seo_description" defaultValue={s.seo_description ?? ""} /></div>
          <button className="admin-btn primary" type="submit">Сохранить настройки</button>
        </form>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Проверка и коммит**

Run: `npx tsc --noEmit`
Браузер: изменить телефон/часы/SEO → проверить шапку, контакты, статус работы и `<title>` страницы.
```bash
git add app/admin/settings
git commit -m "feat: admin editing for site settings"
```

---

## Фаза E — SEO из настроек, финал

### Task 29: Метадата из настроек

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: generateMetadata из настроек**

Заменить статический `export const metadata` в `app/layout.tsx` на функцию. Полный файл:
```tsx
import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "./lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: s.seo_title || "Кирпичные дома в Краснодаре | Готовые дома и строительство",
    description:
      s.seo_description ||
      "Готовые кирпичные дома, дома в строительстве и строительство под заказ в Краснодаре и радиусе 70 км.",
    icons: {
      icon: "/logo/svm-logo-mark-cutout.png",
      apple: "/logo/svm-logo-mark-cutout.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Проверка и коммит**

Run: `npx tsc --noEmit`
Браузер: `<title>` совпадает с `seo_title` из настроек.
```bash
git add app/layout.tsx
git commit -m "feat: page metadata from settings"
```

---

### Task 30: Финальная проверка

**Files:** нет.

- [ ] **Step 1: Полная проверка качества**

Run: `npx tsc --noEmit`
Expected: без ошибок.
Run: `npm run lint`
Expected: без ошибок.
Run (PowerShell): `$env:AUTH_SECRET="test-secret-test-secret-test-secret"; npx tsx --test app/lib/session.test.ts`
Expected: PASS.
Run: `npm run build`
Expected: сборка успешна.

- [ ] **Step 2: Сквозной сценарий в браузере**

`npm run dev`. Проверить:
1. `/` — все секции с данными из базы.
2. `/admin` → редирект на логин; вход `admin`/`admin123`.
3. По каждому разделу: добавить запись, отредактировать, скрыть/показать, удалить; для домов и проектов — загрузить фото и увидеть его на сайте.
4. Изменить настройки (телефон, часы, SEO) — увидеть изменения на сайте.
5. «Выйти» → возврат на логин; `/admin` снова под защитой.

- [ ] **Step 3: Обновить README**

Добавить в `README.md` краткий раздел про админку: запуск Postgres (Docker), `.env`, `npm run db:migrate`, `npm run db:seed`, доступ `/admin`, и что фото лежат в `public/uploads`.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document admin panel setup"
```

---

## Self-review (выполнено автором плана)

- **Покрытие спеки:** дома/стройка/проекты/участки/цены/FAQ/настройки — задачи 22–28; авторизация — 13–15, 20; фото — 18, 22, 23; сид — 7; чтение сайтом из БД — 8–12; кеш `revalidatePath('/')` — во всех мутациях; SEO — 29; локальная БД — 3–4; деплой Beget — описан в спеке (раздел 12), README — 30. Пробелов нет.
- **Заглушки:** отсутствуют; во всех шагах реальный код и команды.
- **Согласованность типов:** имена действий и полей сверены (`createHome/updateHome/deleteHome/toggleHome`, `readData`, `str/num/bool`, `SESSION_COOKIE`, `saveUploadedImage`). Поля форм совпадают с полями моделей Prisma и сидом.
- **Известный нюанс:** в Task 27 вложенные формы исправляются на шаге 3 (удаление вынесено наружу).

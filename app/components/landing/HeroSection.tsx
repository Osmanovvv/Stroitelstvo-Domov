import Image from "next/image";
import { Fragment } from "react";
import { ArrowRight, BadgeCheck, Camera, WalletCards } from "lucide-react";
import { heroDefaults } from "../../content/landing";
import {
  getBuildingHomes,
  getProjects,
  getReadyHomes,
  getSettings,
} from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";

// Заголовок редактируется в админке. Переносы строк — \n, акцентный цвет —
// текст между **двумя звёздочками**. Рендерим в безопасные React-узлы (без
// dangerouslySetInnerHTML): сначала строки, затем внутри каждой — **акценты**.
function renderTitle(title: string) {
  const lines = title.split("\n").filter((line) => line.trim() !== "");
  return lines.map((line, lineIndex) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <span className="hero-line" key={lineIndex}>
        {parts.map((part, partIndex) =>
          partIndex % 2 === 1 ? (
            <span className="text-accent" key={partIndex}>
              {part}
            </span>
          ) : (
            <Fragment key={partIndex}>{part}</Fragment>
          ),
        )}
      </span>
    );
  });
}

export default async function HeroSection() {
  // getSettings/getReadyHomes/getProjects/getBuildingHomes обёрнуты в cache():
  // эти же запросы делают секции ниже, поэтому новых обращений к БД нет —
  // счётчики панели берём из тех же данных, что и карточки на странице.
  const [settings, readyHomes, buildingHomes, projects] = await Promise.all([
    getSettings(),
    getReadyHomes(),
    getBuildingHomes(),
    getProjects(),
  ]);

  const title = settings.hero_title || heroDefaults.title;
  const subtitle = settings.hero_subtitle || heroDefaults.subtitle;
  const image = settings.hero_image || heroDefaults.image;

  const stats = [
    { value: readyHomes.length, label: "готовых домов" },
    { value: buildingHomes.length, label: "объектов строится" },
    { value: projects.length, label: "типовых проектов" },
  ];

  return (
    <section className="hero" id="top">
      <Image
        className="hero-image"
        src={image}
        alt="Современный кирпичный дом с теплой подсветкой в сумерках"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          <span className="eyebrow">Готовые дома и строительство под заказ</span>
          <h1>{renderTitle(title)}</h1>
          <p>{subtitle}</p>
          <div className="hero-badges" role="group" aria-label="Преимущества">
            <span>
              <BadgeCheck size={17} />
              Договор и смета
            </span>
            <span>
              <Camera size={17} />
              Объекты можно посмотреть
            </span>
            <span>
              <WalletCards size={17} />
              Ипотека Сбер, ВТБ, Альфа
            </span>
          </div>
          <div className="hero-actions">
            <LeadModalTrigger className="button primary" title="Узнать стоимость строительства">
              Узнать стоимость строительства
              <ArrowRight size={18} />
            </LeadModalTrigger>
            <a className="button secondary" href="#homes">
              Смотреть дома
            </a>
          </div>
          <span className="hero-note">
            Расчет, подбор проекта и варианты ипотеки в одном запросе
          </span>
        </div>
        <div className="hero-panel" role="group" aria-label="Ключевые показатели">
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

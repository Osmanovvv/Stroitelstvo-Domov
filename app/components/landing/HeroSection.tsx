import Image from "next/image";
import { Fragment } from "react";
import { ArrowRight, BadgeCheck, Camera, WalletCards } from "lucide-react";
import { heroDefaults } from "../../content/landing";
import { getSettings } from "../../lib/queries";
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
  const settings = await getSettings();

  const title = settings.hero_title || heroDefaults.title;
  const subtitle = settings.hero_subtitle || heroDefaults.subtitle;
  const image = settings.hero_image || heroDefaults.image;

  // Иконки фиксированы по позиции, текст редактируется в админке (hero_badge_1..3).
  const badgeIcons = [BadgeCheck, Camera, WalletCards];
  const badges = heroDefaults.badges.map((def, i) => ({
    Icon: badgeIcons[i],
    text: settings[`hero_badge_${i + 1}`] || def,
  }));

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
            {badges.map(({ Icon, text }, i) => (
              <span key={i}>
                <Icon size={20} />
                {text}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            <LeadModalTrigger className="button primary" title="Узнать стоимость строительства" withFile>
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
      </div>
    </section>
  );
}

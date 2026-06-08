import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { heroDefaults } from "../../content/landing";
import { getSettings } from "../../lib/queries";

export default async function HeroSection() {
  const settings = await getSettings();
  const title = settings.hero_title || heroDefaults.title;
  const subtitle = settings.hero_subtitle || heroDefaults.subtitle;
  const image = settings.hero_image || heroDefaults.image;
  const titleLines = title.split("\n").filter((line) => line.trim() !== "");

  return (
    <section className="hero" id="top">
      <Image
        className="hero-image"
        src={image}
        alt="Современный кирпичный дом в вечернем свете"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          <h1>
            {titleLines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h1>
          <p className="hero-service-line">{subtitle}</p>
          <div className="hero-actions">
            <a className="button primary" href="#homes">
              Смотреть дома
              <ArrowRight size={18} />
            </a>
            <a className="button secondary" href="#calc">
              Пройти подбор
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

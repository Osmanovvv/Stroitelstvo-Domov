import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero" id="top">
      <Image
        className="hero-image"
        src="/hero/generated-brick-house-hero.png"
        alt="Современный кирпичный дом в вечернем свете"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-copy">
          <h1>
            <span>Строим вашу мечту:</span>{" "}
            <span>кирпичные дома</span>{" "}
            <span>в Краснодаре</span>
          </h1>
          <p className="hero-service-line">Готовые дома · Проекты · Строительство под ключ</p>
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

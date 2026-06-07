import Image from "next/image";
import { ArrowRight, Bath, BedDouble, MapPin, Ruler, Trees } from "lucide-react";
import { getReadyHomes } from "../../lib/queries";

export default async function HomesSection() {
  const readyHomes = await getReadyHomes();
  return (
    <section className="section" id="homes">
      <div className="container section-head">
        <span className="eyebrow">Готовые дома</span>
        <h2>Объекты, которые можно посмотреть вживую</h2>
        <p>Выберите готовый дом с участком, коммуникациями и понятными условиями покупки.</p>
      </div>
      <div className="container homes-grid">
        {readyHomes.map((home) => (
          <article className="home-card" key={home.title}>
            <div className="home-image-wrap">
              <Image
                src={home.image}
                alt={home.title}
                width={820}
                height={560}
                sizes="(max-width: 900px) 100vw, 33vw"
              />
              <span>{home.status}</span>
            </div>
            <div className="home-card-body">
              <div className="home-card-title">
                <h3>{home.title}</h3>
                <strong>{home.price}</strong>
              </div>
              <p className="location">
                <MapPin size={16} />
                {home.location}
              </p>
              <div className="spec-grid">
                <span>
                  <Ruler size={16} />
                  {home.area}
                </span>
                <span>
                  <Trees size={16} />
                  {home.land}
                </span>
                <span>
                  <BedDouble size={16} />
                  {home.rooms}
                </span>
                <span>
                  <Bath size={16} />
                  {home.baths}
                </span>
              </div>
              <a className="text-link" href="#contacts">
                Записаться на просмотр
                <ArrowRight size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

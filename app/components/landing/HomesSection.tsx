import { ArrowRight, Bath, BedDouble, MapPin, Ruler, Trees } from "lucide-react";
import { getReadyHomes } from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";
import ProjectSlider from "../ProjectSlider";
import SectionHead from "../SectionHead";

const HOME_IMAGE_SIZES =
  "(max-width: 760px) calc(100vw - 44px), (max-width: 1040px) calc((100vw - 90px) / 2), 33vw";

export default async function HomesSection() {
  const readyHomes = await getReadyHomes();
  return (
    <section className="section" id="homes">
      <SectionHead id="homes" />
      <div className="container homes-grid">
        {readyHomes.map((home) => {
          const gallery = [home.image, home.image2, home.image3, home.image4].filter(
            (src): src is string => Boolean(src),
          );

          return (
          <article className="home-card" key={home.id}>
            <div className="home-image-wrap">
              <ProjectSlider images={gallery} alt={home.title} sizes={HOME_IMAGE_SIZES} />
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
              <LeadModalTrigger className="text-link" title="Записаться на просмотр">
                Записаться на просмотр
                <ArrowRight size={17} />
              </LeadModalTrigger>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

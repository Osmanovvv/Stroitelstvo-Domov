import { ArrowRight, CalendarCheck, Hammer, MapPin } from "lucide-react";
import { getBuildingHomes } from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";
import ProjectSlider from "../ProjectSlider";
import SectionHead from "../SectionHead";

const BUILDING_IMAGE_SIZES =
  "(max-width: 760px) calc(100vw - 44px), (max-width: 1040px) calc((100vw - 90px) / 2), 33vw";

export default async function BuildingSection() {
  const buildingHomes = await getBuildingHomes();
  return (
    <section className="section split-section" id="building">
      <SectionHead id="building" />
      <div className="container media-card-grid">
        {buildingHomes.map((item) => {
          const gallery = [item.image, item.image2, item.image3, item.image4].filter(
            (src): src is string => Boolean(src),
          );

          return (
            <article className="media-card" key={item.id}>
              <div className="media-card-image">
                <ProjectSlider images={gallery} alt={item.title} sizes={BUILDING_IMAGE_SIZES} />
                {item.stage && (
                  <span className="media-card-badge">
                    <Hammer size={14} />
                    {item.stage}
                  </span>
                )}
              </div>
              <div className="media-card-body">
                <h3>{item.title}</h3>
                <div className="media-card-meta">
                  <span>
                    <MapPin size={15} />
                    {item.location}
                  </span>
                  <span>
                    <CalendarCheck size={15} />
                    {item.finish}
                  </span>
                </div>
                <LeadModalTrigger className="text-link" title="Узнать условия брони">
                  Узнать условия брони
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

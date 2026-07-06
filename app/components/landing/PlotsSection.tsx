import { ArrowRight, MapPin, Plug, Ruler } from "lucide-react";
import { getPlots } from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";
import ProjectSlider from "../ProjectSlider";
import SectionHead from "../SectionHead";

const PLOT_IMAGE_SIZES =
  "(max-width: 760px) calc(100vw - 44px), (max-width: 1040px) calc((100vw - 90px) / 2), 33vw";

export default async function PlotsSection() {
  const plots = await getPlots();
  return (
    <section className="section" id="plots">
      <SectionHead id="plots" />
      <div className="container media-card-grid">
        {plots.map((plot) => {
          const gallery = [plot.image, plot.image2, plot.image3, plot.image4].filter(
            (src): src is string => Boolean(src),
          );

          return (
            <article className="media-card" key={plot.id}>
              <div className="media-card-image">
                <ProjectSlider images={gallery} alt={plot.title} sizes={PLOT_IMAGE_SIZES} />
                {plot.area && (
                  <span className="media-card-badge">
                    <Ruler size={14} />
                    {plot.area}
                  </span>
                )}
              </div>
              <div className="media-card-body">
                <h3>{plot.title}</h3>
                <div className="media-card-meta">
                  <span>
                    <MapPin size={15} />
                    {plot.location}
                  </span>
                  <span>
                    <Plug size={15} />
                    {plot.utilities}
                  </span>
                </div>
                <LeadModalTrigger className="text-link" title="Подобрать участок">
                  Подобрать участок
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

import { MapPin } from "lucide-react";
import { plots } from "../../content/landing";

export default function PlotsSection() {
  return (
    <section className="section" id="plots">
      <div className="container two-column">
        <div className="section-head left">
          <span className="eyebrow">Участки под строительство</span>
          <h2>
            Земля под дом <span className="text-accent">без отдельного поиска</span>
          </h2>
          <p>
            Предложим участок и проект дома, который можно разместить с учетом площади,
            подъезда и коммуникаций.
          </p>
        </div>
        <div className="plot-list">
          {plots.map((plot) => (
            <article className="plot-item" key={plot.title}>
              <MapPin />
              <div>
                <h3>{plot.title}</h3>
                <p>{plot.location}</p>
                <span>
                  {plot.area} · {plot.utilities}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

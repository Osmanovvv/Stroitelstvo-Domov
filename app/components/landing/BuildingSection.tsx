import { ArrowRight } from "lucide-react";
import { buildingHomes } from "../../content/landing";

export default function BuildingSection() {
  return (
    <section className="section split-section" id="building">
      <div className="container split-layout">
        <div>
          <span className="eyebrow">Дома в строительстве</span>
          <h2>Объекты, которые можно забронировать до сдачи</h2>
          <p>
            Дома на разных этапах готовности: можно посмотреть ход строительства,
            уточнить срок сдачи и условия бронирования.
          </p>
          <a className="button dark" href="#contacts">
            Узнать условия брони
            <ArrowRight size={18} />
          </a>
        </div>
        <div className="building-list">
          {buildingHomes.map((item) => (
            <article className="building-item" key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.location}</p>
              </div>
              <div className="building-meta">
                <span>{item.stage}</span>
                <strong>{item.finish}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

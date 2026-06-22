import { CalendarCheck, MapPin, Ruler } from "lucide-react";
import { getBuiltObjects } from "../../lib/queries";
import ProjectSlider from "../ProjectSlider";

const BUILT_IMAGE_SIZES =
  "(max-width: 760px) calc(100vw - 44px), (max-width: 1040px) calc((100vw - 90px) / 2), 33vw";

export default async function BuiltSection() {
  const builtObjects = await getBuiltObjects();

  // Секцию рендерим всегда (как остальные ресурсные секции) — иначе пункт меню
  // «Построенные объекты» (#built) вёл бы в никуда, если заказчик скроет все.

  return (
    <section className="section tinted" id="built">
      <div className="container section-head">
        <span className="eyebrow">Построенные объекты</span>
        <h2>Дома, которые мы уже сдали</h2>
        <p>Реальные объекты нашей компании — от фундамента до сдачи под ключ.</p>
      </div>
      <div className="container built-grid">
        {builtObjects.map((object) => {
          const gallery = [object.image, object.image2, object.image3, object.image4].filter(
            (src): src is string => Boolean(src),
          );

          return (
            <article className="built-card" key={object.id}>
              <div className="built-image-wrap">
                <ProjectSlider images={gallery} alt={object.title} sizes={BUILT_IMAGE_SIZES} />
                {object.year && (
                  <span className="built-year">
                    <CalendarCheck size={14} />
                    Сдан в {object.year}
                  </span>
                )}
              </div>
              <div className="built-card-body">
                <h3>{object.title}</h3>
                <div className="built-meta">
                  <span>
                    <Ruler size={15} />
                    {object.area}
                  </span>
                  <span>
                    <MapPin size={15} />
                    {object.location}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

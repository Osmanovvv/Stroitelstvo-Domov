import { trustItems } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import { sectionBgStyle } from "../../lib/sectionBg";
import SectionHead from "../SectionHead";

export default async function TrustSection() {
  const s = await getSettings();
  const bg = s.trust_bg_image;
  return (
    <section
      className={`section trust-section${bg ? " has-bg" : ""}`}
      style={sectionBgStyle(bg)}
    >
      <SectionHead id="trust" />
      <div className="container trust-grid">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className="trust-item" key={item.title}>
              <span className="trust-icon">
                <Icon />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

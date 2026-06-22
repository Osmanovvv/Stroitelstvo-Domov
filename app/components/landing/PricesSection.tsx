import { Check } from "lucide-react";
import { buildPackages } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";

export default async function PricesSection() {
  const settings = await getSettings();
  const packages = buildPackages(settings);

  return (
    <section className="section" id="prices">
      <div className="container section-head">
        <span className="eyebrow">Комплектации и цены</span>
        <h2>
          Выберите <span className="text-accent">комплектацию</span>
        </h2>
        <p>Три формата строительства — от тёплого контура до дома под ключ.</p>
      </div>
      <div className="container package-grid">
        {packages.map((pkg) => (
          <article className="package-card" key={pkg.key}>
            <strong>{pkg.title}</strong>
            <span className="package-sub">{pkg.sub}</span>
            <ul>
              {pkg.items.map((item, index) => (
                <li key={index}>
                  <Check size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <LeadModalTrigger
              className="button primary package-cta"
              title={`Рассчитать стоимость — ${pkg.title}`}
            >
              Рассчитать стоимость
            </LeadModalTrigger>
          </article>
        ))}
      </div>
    </section>
  );
}

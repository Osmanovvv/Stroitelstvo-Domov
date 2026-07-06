import { Check } from "lucide-react";
import { buildPackages } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import LeadModalTrigger from "../LeadModalTrigger";
import SectionHead from "../SectionHead";

export default async function PricesSection() {
  const settings = await getSettings();
  const packages = buildPackages(settings);

  return (
    <section className="section" id="prices">
      <SectionHead id="prices" />
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
              withFile
            >
              Рассчитать стоимость
            </LeadModalTrigger>
          </article>
        ))}
      </div>
    </section>
  );
}

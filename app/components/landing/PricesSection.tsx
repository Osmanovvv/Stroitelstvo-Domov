import { buildPackages } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import PackageList from "../PackageList";
import SectionHead from "../SectionHead";

export default async function PricesSection() {
  const settings = await getSettings();
  const packages = buildPackages(settings);

  return (
    <section className="section" id="prices">
      <SectionHead id="prices" />
      <PackageList packages={packages} />
    </section>
  );
}

import { House, KeyRound } from "lucide-react";
import { compareDefaults } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import { renderAccent } from "../../lib/accent";

// Список features хранится строкой (по пункту на строку); пусто = дефолт.
function lines(value: string | undefined, fallback: string[]): string[] {
  const parsed = (value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length ? parsed : fallback;
}

export default async function CompareSection() {
  const s = await getSettings();
  const d = compareDefaults;

  const houseFeatures = lines(s.compare_house_features, d.houseFeatures);
  const flatFeatures = lines(s.compare_flat_features, d.flatFeatures);

  return (
    <section className="section compare-section">
      <div className="container compare-layout">
        <div>
          <span className="eyebrow">{s.compare_eyebrow || d.eyebrow}</span>
          <h2>{renderAccent(s.compare_title || d.title)}</h2>
          <p>{s.compare_subtitle || d.subtitle}</p>
        </div>
        <div className="compare-card" aria-label="Сравнение дома и квартиры">
          <div>
            <House />
            <h3>{s.compare_house_title || d.houseTitle}</h3>
            <ul>
              {houseFeatures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <strong>{s.compare_house_price || d.housePrice}</strong>
          </div>
          <div>
            <KeyRound />
            <h3>{s.compare_flat_title || d.flatTitle}</h3>
            <ul>
              {flatFeatures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <strong>{s.compare_flat_price || d.flatPrice}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

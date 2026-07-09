"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import LeadModalTrigger from "./LeadModalTrigger";

type Pkg = { key: string; title: string; sub: string; items: string[] };

// Комплектации. На мобиле — аккордеон (первая раскрыта, остальные свёрнуты; тап по
// заголовку раскрывает список), чтобы секция не занимала пол-экрана на каждую.
// На десктопе все списки всегда видны — сворачивание отключено в CSS (≤680px only).
export default function PackageList({ packages }: { packages: Pkg[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(packages.map((p, i) => [p.key, i === 0])),
  );

  return (
    <div className="container package-grid">
      {packages.map((pkg) => {
        const isOpen = !!open[pkg.key];
        return (
          <article className={`package-card${isOpen ? " is-open" : ""}`} key={pkg.key}>
            <button
              type="button"
              className="package-head"
              aria-expanded={isOpen}
              onClick={() => setOpen((s) => ({ ...s, [pkg.key]: !s[pkg.key] }))}
            >
              <span className="package-head-text">
                <strong>{pkg.title}</strong>
                <span className="package-sub">{pkg.sub}</span>
              </span>
              <ChevronDown className="package-chevron" size={22} aria-hidden="true" />
            </button>
            <div className="package-body">
              <div className="package-body-inner">
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
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

import Image from "next/image";
import { bankItems, mortgageFeatures, sectionIntros } from "../../content/landing";
import { getSettings } from "../../lib/queries";
import { renderAccent } from "../../lib/accent";
import { sectionBgStyle } from "../../lib/sectionBg";
import LeadModalTrigger from "../LeadModalTrigger";

export default async function PaymentSection() {
  const s = await getSettings();
  const d = sectionIntros.payment;
  const bg = s.payment_bg_image;
  return (
    <section className="section payment-section" id="mortgage" style={sectionBgStyle(bg)}>
      <div className="container payment-inner">
        <div className="payment-head">
          <span className="eyebrow">{s.payment_eyebrow || d.eyebrow}</span>
          <h2>{renderAccent(s.payment_title || d.title)}</h2>
          <p>{s.payment_subtitle || d.subtitle}</p>
        </div>

        <div className="payment-points">
          {mortgageFeatures.map((feature) => (
            <div className="payment-point" key={feature.title}>
              <span className="payment-dot" aria-hidden="true" />
              <strong>{feature.title}</strong>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>

        <div className="payment-foot">
          <LeadModalTrigger className="button primary" title="Рассчитать ипотеку" withFile>
            Рассчитать стоимость
          </LeadModalTrigger>
          <div className="bank-row" aria-label="Банки-партнёры">
            {bankItems.map((bank) => (
              <span className="bank-chip" key={bank.name}>
                <Image
                  src={bank.logo}
                  alt={bank.name}
                  width={bank.logoWidth}
                  height={bank.logoHeight}
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

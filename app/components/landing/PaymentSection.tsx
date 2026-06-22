import Image from "next/image";
import { bankItems, mortgageFeatures } from "../../content/landing";
import LeadModalTrigger from "../LeadModalTrigger";

export default function PaymentSection() {
  return (
    <section className="section payment-section" id="mortgage">
      <div className="container payment-inner">
        <div className="payment-head">
          <span className="eyebrow">Ипотека и рассрочка</span>
          <h2>
            Дом в ипотеку <span className="text-accent">от 5,9%</span> или рассрочка от компании
          </h2>
          <p>
            Аккредитованы в крупных банках — поможем подобрать программу и собрать документы.
          </p>
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
          <LeadModalTrigger className="button primary" title="Рассчитать ипотеку">
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

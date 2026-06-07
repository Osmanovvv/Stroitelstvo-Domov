import Image from "next/image";
import { Clock3, KeyRound, WalletCards } from "lucide-react";
import { bankItems } from "../../content/landing";

export default function PaymentSection() {
  return (
    <section className="section payment-section">
      <div className="container payment-card">
        <div>
          <span className="eyebrow">Оплата и ипотека</span>
          <h2>
            Аккредитованы в <span className="text-accent">крупных банках</span>
          </h2>
          <p>
            Поможем подобрать ипотечную программу для готового дома, объекта в строительстве
            или строительства под заказ.
          </p>
          <div className="bank-grid" aria-label="Банки партнеры">
            {bankItems.map((bank) => (
              <span className="bank-item" key={bank.name}>
                <span className="bank-logo-wrap">
                  <Image
                    className="bank-logo"
                    src={bank.logo}
                    alt={`Логотип ${bank.name}`}
                    width={bank.logoWidth}
                    height={bank.logoHeight}
                  />
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="payment-points">
          <span>
            <WalletCards />
            Ипотека и семейные программы
          </span>
          <span>
            <KeyRound />
            Бронь строящихся объектов
          </span>
          <span>
            <Clock3 />
            Поэтапная оплата строительства
          </span>
        </div>
      </div>
    </section>
  );
}

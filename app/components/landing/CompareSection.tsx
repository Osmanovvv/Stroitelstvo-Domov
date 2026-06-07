import { House, KeyRound } from "lucide-react";

export default function CompareSection() {
  return (
    <section className="section compare-section">
      <div className="container compare-layout">
        <div>
          <span className="eyebrow">Дом или квартира</span>
          <h2>
            Сравните <span className="text-accent">дом в ипотеку</span> и квартиру в аренду
          </h2>
          <p>
            Для семей, которые переезжают в Краснодар, показываем понятную разницу:
            площадь, участок, платеж и уровень свободы.
          </p>
        </div>
        <div className="compare-card" aria-label="Сравнение дома и квартиры">
          <div>
            <House />
            <h3>Дом</h3>
            <ul>
              <li>от 94 м²</li>
              <li>участок от 5 соток</li>
              <li>своя парковка и двор</li>
            </ul>
            <strong>от 40 000 ₽ / месяц</strong>
          </div>
          <div>
            <KeyRound />
            <h3>Квартира</h3>
            <ul>
              <li>60-80 м²</li>
              <li>без участка</li>
              <li>аренда без собственности</li>
            </ul>
            <strong>от 40 000 ₽ / месяц</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

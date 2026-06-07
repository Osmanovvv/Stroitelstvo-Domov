import { priceRows } from "../../content/landing";

export default function PricesSection() {
  return (
    <section className="section" id="prices">
      <div className="container section-head">
        <span className="eyebrow">Комплектации и цены</span>
        <h2>
          Подробная <span className="text-accent">таблица комплектаций</span>
        </h2>
        <p>Сравните основные работы и выберите формат строительства под свой бюджет.</p>
      </div>
      <div className="container price-table-wrap">
        <table className="price-table">
          <thead>
            <tr>
              <th>Тип работ</th>
              <th>
                Теплый контур<br />
                <strong>от 48 000 ₽/м²</strong>
              </th>
              <th>
                Предчистовая<br />
                <strong>от 62 000 ₽/м²</strong>
              </th>
              <th>
                Под ключ<br />
                <strong>от 78 000 ₽/м²</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row) => (
              <tr key={row.work}>
                <td>{row.work}</td>
                <td data-label="Теплый контур">{row.warm}</td>
                <td data-label="Предчистовая">{row.pre}</td>
                <td data-label="Под ключ">{row.full}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

import { getPriceRows, getSettings } from "../../lib/queries";

export default async function PricesSection() {
  const [priceRows, settings] = await Promise.all([getPriceRows(), getSettings()]);

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
                {settings.price_warm_label}
                <br />
                <strong>{settings.price_warm_value}</strong>
              </th>
              <th>
                {settings.price_pre_label}
                <br />
                <strong>{settings.price_pre_value}</strong>
              </th>
              <th>
                {settings.price_full_label}
                <br />
                <strong>{settings.price_full_value}</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row) => (
              <tr key={row.id}>
                <td>{row.work}</td>
                <td data-label={settings.price_warm_label}>{row.warm}</td>
                <td data-label={settings.price_pre_label}>{row.pre}</td>
                <td data-label={settings.price_full_label}>{row.full}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

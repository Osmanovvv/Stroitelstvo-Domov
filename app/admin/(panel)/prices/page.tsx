import InlineDeleteButton from "@/app/admin/components/InlineDeleteButton";
import { getPriceRows, getSettings } from "@/app/lib/queries";
import { addRow, saveAllRows, deleteRow, updatePackages } from "./actions";

export const dynamic = "force-dynamic";

export default async function PricesAdmin() {
  const [rows, s] = await Promise.all([getPriceRows(), getSettings()]);

  return (
    <>
      <div className="admin-topbar"><h2>Цены и комплектации</h2></div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Заголовки пакетов</h3>
        <form action={updatePackages}>
          <div className="admin-packages-grid">
            <fieldset className="admin-package">
              <legend>Пакет 1</legend>
              <div className="admin-field">
                <label>Название</label>
                <input name="price_warm_label" defaultValue={s.price_warm_label ?? ""} placeholder="Теплый контур" />
              </div>
              <div className="admin-field">
                <label>Цена</label>
                <input name="price_warm_value" defaultValue={s.price_warm_value ?? ""} placeholder="от 48 000 ₽/м²" />
              </div>
            </fieldset>
            <fieldset className="admin-package">
              <legend>Пакет 2</legend>
              <div className="admin-field">
                <label>Название</label>
                <input name="price_pre_label" defaultValue={s.price_pre_label ?? ""} placeholder="Предчистовая" />
              </div>
              <div className="admin-field">
                <label>Цена</label>
                <input name="price_pre_value" defaultValue={s.price_pre_value ?? ""} placeholder="от 62 000 ₽/м²" />
              </div>
            </fieldset>
            <fieldset className="admin-package">
              <legend>Пакет 3</legend>
              <div className="admin-field">
                <label>Название</label>
                <input name="price_full_label" defaultValue={s.price_full_label ?? ""} placeholder="Под ключ" />
              </div>
              <div className="admin-field">
                <label>Цена</label>
                <input name="price_full_value" defaultValue={s.price_full_value ?? ""} placeholder="от 78 000 ₽/м²" />
              </div>
            </fieldset>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn primary" type="submit">Сохранить заголовки</button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-topbar" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Строки таблицы</h3>
          <form action={addRow}>
            <button className="admin-btn primary" type="submit">Добавить строку</button>
          </form>
        </div>
        <form action={saveAllRows}>
          <table className="admin-table">
            <thead>
              <tr><th>Работа</th><th>Пакет 1</th><th>Пакет 2</th><th>Пакет 3</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td colSpan={5}>
                    <input type="hidden" name="rowId" value={row.id} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) auto", gap: 8, alignItems: "center" }}>
                      <input name={`work_${row.id}`} defaultValue={row.work} placeholder="Работа" />
                      <input name={`warm_${row.id}`} defaultValue={row.warm} placeholder="Пакет 1" />
                      <input name={`pre_${row.id}`} defaultValue={row.pre} placeholder="Пакет 2" />
                      <input name={`full_${row.id}`} defaultValue={row.full} placeholder="Пакет 3" />
                      <InlineDeleteButton action={deleteRow.bind(null, row.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-form-actions">
            <button className="admin-btn primary" type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </>
  );
}

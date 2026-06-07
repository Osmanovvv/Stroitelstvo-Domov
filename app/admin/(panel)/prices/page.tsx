import { prisma } from "@/app/lib/db";
import InlineDeleteButton from "@/app/admin/components/InlineDeleteButton";
import { addRow, saveAllRows, deleteRow, updatePackages } from "./actions";

export const dynamic = "force-dynamic";

export default async function PricesAdmin() {
  const [rows, settingsRows] = await Promise.all([
    prisma.priceRow.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);
  const s = Object.fromEntries(settingsRows.map((r) => [r.key, r.value]));

  return (
    <>
      <div className="admin-topbar"><h2>Цены и комплектации</h2></div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Заголовки пакетов</h3>
        <form className="admin-form" action={updatePackages}>
          <div className="admin-field">
            <label>Пакет 1 — название</label>
            <input name="price_warm_label" defaultValue={s.price_warm_label ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 1 — цена</label>
            <input name="price_warm_value" defaultValue={s.price_warm_value ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 2 — название</label>
            <input name="price_pre_label" defaultValue={s.price_pre_label ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 2 — цена</label>
            <input name="price_pre_value" defaultValue={s.price_pre_value ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 3 — название</label>
            <input name="price_full_label" defaultValue={s.price_full_label ?? ""} />
          </div>
          <div className="admin-field">
            <label>Пакет 3 — цена</label>
            <input name="price_full_value" defaultValue={s.price_full_value ?? ""} />
          </div>
          <button className="admin-btn primary" type="submit">Сохранить заголовки</button>
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

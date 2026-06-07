import { prisma } from "@/app/lib/db";
import DeleteButton from "@/app/admin/components/DeleteButton";
import { createRow, updateRow, deleteRow, updatePackages } from "./actions";

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

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Строки таблицы</h3>
        <table className="admin-table">
          <thead>
            <tr><th>Работа</th><th>Пакет 1</th><th>Пакет 2</th><th>Пакет 3</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td colSpan={5}>
                  <form className="admin-form" action={updateRow} style={{ maxWidth: "none" }}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="sortOrder" value={row.sortOrder} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr) auto auto", gap: 8, alignItems: "center" }}>
                      <input name="work" defaultValue={row.work} />
                      <input name="warm" defaultValue={row.warm} />
                      <input name="pre" defaultValue={row.pre} />
                      <input name="full" defaultValue={row.full} />
                      <button className="admin-btn" type="submit">Сохранить</button>
                    </div>
                  </form>
                  <div style={{ marginTop: 6 }}>
                    <DeleteButton action={deleteRow} id={row.id} label="Удалить строку" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3>Добавить строку</h3>
        <form className="admin-form" action={createRow}>
          <div className="admin-field"><label>Работа</label><input name="work" required /></div>
          <div className="admin-field"><label>Пакет 1</label><input name="warm" /></div>
          <div className="admin-field"><label>Пакет 2</label><input name="pre" /></div>
          <div className="admin-field"><label>Пакет 3</label><input name="full" /></div>
          <button className="admin-btn primary" type="submit">Добавить</button>
        </form>
      </div>
    </>
  );
}

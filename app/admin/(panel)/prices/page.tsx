import ToastForm from "@/app/admin/components/ToastForm";
import { packageDefaults } from "@/app/content/landing";
import { getSettings } from "@/app/lib/queries";
import { updatePackages } from "./actions";

export const dynamic = "force-dynamic";

const SLOT_LABELS: Record<string, string> = {
  warm: "Пакет 1",
  pre: "Пакет 2",
  full: "Пакет 3",
};

export default async function PricesAdmin() {
  const s = await getSettings();

  return (
    <>
      <div className="admin-topbar">
        <h2>Комплектации</h2>
      </div>

      <div className="admin-card">
        <p style={{ marginTop: 0, color: "#8a93a6", fontSize: 13 }}>
          Три карточки в разделе «Цены» на сайте. В поле «Что входит» — по одной работе на строку.
        </p>
        <ToastForm action={updatePackages} message="Сохранено">
          <div className="admin-packages-grid">
            {packageDefaults.map((p) => (
              <fieldset className="admin-package" key={p.key}>
                <legend>{SLOT_LABELS[p.key]}</legend>
                <div className="admin-field">
                  <label>Название</label>
                  <input
                    name={`price_${p.key}_label`}
                    defaultValue={s[`price_${p.key}_label`] ?? ""}
                    placeholder={p.title}
                  />
                </div>
                <div className="admin-field">
                  <label>Подзаголовок</label>
                  <input
                    name={`price_${p.key}_sub`}
                    defaultValue={s[`price_${p.key}_sub`] ?? ""}
                    placeholder={p.sub}
                  />
                </div>
                <div className="admin-field">
                  <label>Что входит (по строке на пункт)</label>
                  <textarea
                    name={`price_${p.key}_items`}
                    rows={9}
                    defaultValue={s[`price_${p.key}_items`] ?? ""}
                    placeholder={p.items.join("\n")}
                  />
                </div>
              </fieldset>
            ))}
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn primary" type="submit">
              Сохранить
            </button>
          </div>
        </ToastForm>
      </div>
    </>
  );
}

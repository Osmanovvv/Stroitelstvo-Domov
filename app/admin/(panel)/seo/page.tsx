import { getSettings } from "@/app/lib/queries";
import ToastForm from "@/app/admin/components/ToastForm";
import { updateSeo } from "./actions";

export const dynamic = "force-dynamic";

export default async function SeoAdmin() {
  const s = await getSettings();

  return (
    <>
      <div className="admin-topbar"><h2>SEO</h2></div>
      <div className="admin-card">
        <ToastForm className="admin-form" action={updateSeo} message="Сохранено">
          <div className="admin-field">
            <label>Заголовок страницы (title)</label>
            <input
              name="seo_title"
              defaultValue={s.seo_title ?? ""}
              placeholder="Кирпичные дома в Краснодаре | Готовые дома и строительство"
            />
            <small style={{ color: "#8a93a6", fontSize: 12 }}>
              Показывается во вкладке браузера и в результатах поиска. Оптимально 50–60 символов.
            </small>
          </div>
          <div className="admin-field">
            <label>Описание страницы (description)</label>
            <textarea
              name="seo_description"
              defaultValue={s.seo_description ?? ""}
              placeholder="Готовые кирпичные дома, дома в строительстве и строительство под заказ в Краснодаре и радиусе 70 км."
            />
            <small style={{ color: "#8a93a6", fontSize: 12 }}>
              Короткое описание под заголовком в поиске. Оптимально 120–160 символов.
            </small>
          </div>
          <button className="admin-btn primary" type="submit">Сохранить SEO</button>
        </ToastForm>
      </div>
    </>
  );
}

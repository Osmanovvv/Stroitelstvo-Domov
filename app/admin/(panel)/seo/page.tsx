import { getSettings } from "@/app/lib/queries";
import ToastForm from "@/app/admin/components/ToastForm";
import { SEO_DEFAULTS } from "@/app/lib/seo";
import { updateSeo } from "./actions";

export const dynamic = "force-dynamic";

const hint = { color: "#8a93a6", fontSize: 12 } as const;

export default async function SeoAdmin() {
  const s = await getSettings();

  return (
    <>
      <div className="admin-topbar"><h2>SEO</h2></div>
      <div className="admin-card">
        <ToastForm className="admin-form" action={updateSeo} message="Сохранено">
          <div className="admin-field">
            <label>Заголовок страницы (title)</label>
            <input name="seo_title" defaultValue={s.seo_title ?? ""} placeholder={SEO_DEFAULTS.title} />
            <small style={hint}>Показывается во вкладке браузера и в результатах поиска. Оптимально 50–60 символов.</small>
          </div>

          <div className="admin-field">
            <label>Описание страницы (description)</label>
            <textarea name="seo_description" defaultValue={s.seo_description ?? ""} placeholder={SEO_DEFAULTS.description} />
            <small style={hint}>Короткое описание под заголовком в поиске. Оптимально 120–160 символов.</small>
          </div>

          <div className="admin-field">
            <label>Название бренда / компании</label>
            <input name="seo_site_name" defaultValue={s.seo_site_name ?? ""} placeholder={SEO_DEFAULTS.siteName} />
            <small style={hint}>Используется в микроразметке и при шаринге ссылки (OpenGraph, соцсети, мессенджеры).</small>
          </div>

          <div className="admin-field">
            <label>Адрес сайта (домен)</label>
            <input name="site_url" defaultValue={s.site_url ?? ""} placeholder={SEO_DEFAULTS.siteUrl} />
            <small style={hint}>
              Полный адрес сайта — от него строятся canonical, карта сайта и OpenGraph. Когда появится домен
              (например, https://svmdom.ru) — впишите его сюда. Сейчас по умолчанию — тестовый адрес.
            </small>
          </div>

          <div className="admin-field">
            <label>Код подтверждения Яндекс.Вебмастер</label>
            <input name="yandex_verification" defaultValue={s.yandex_verification ?? ""} placeholder="напр. a1b2c3d4e5f6, f45b6caf26a904ea" />
            <small style={hint}>
              Значение из мета-тега проверки прав в Яндекс.Вебмастере (только код, без всего тега). Пусто — тег не
              выводится. Можно указать <b>несколько кодов через запятую</b> — если сайт подтверждают разные аккаунты
              (владелец и подрядчик) или разные записи в Вебмастере (svm93.ru и https://svm93.ru).
            </small>
          </div>

          <div className="admin-field">
            <label>Код подтверждения Google Search Console</label>
            <input name="google_verification" defaultValue={s.google_verification ?? ""} placeholder="напр. A1B2C3..." />
            <small style={hint}>
              Значение из мета-тега google-site-verification (только код). Пусто — тег не выводится. Можно указать{" "}
              <b>несколько кодов через запятую</b> — если сайт подтверждают разные аккаунты.
            </small>
          </div>

          <button className="admin-btn primary" type="submit">Сохранить SEO</button>
        </ToastForm>
      </div>
    </>
  );
}

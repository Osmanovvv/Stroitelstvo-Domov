// Единый источник SEO-значений для метаданных, robots, sitemap, manifest и
// микроразметки. Всё редактируется через админку («SEO»); пусто → дефолт.

export const SEO_DEFAULTS = {
  title: "Кирпичные дома в Краснодаре | Готовые дома и строительство под ключ",
  description:
    "Готовые кирпичные дома, объекты в строительстве и строительство под заказ в Краснодаре и радиусе 70 км. Проекты 80–140 м², ипотека от 5,9%, договор и смета. Строим вашу мечту с 2016 года.",
  siteName: "СВМ — строительство домов",
  siteUrl: "http://155.212.222.79",
  ogImage: "/og-cover.png",
};

export type SeoData = {
  title: string;
  description: string;
  siteName: string;
  siteUrl: string; // абсолютный, без завершающего слэша
  ogImage: string; // абсолютный URL картинки OpenGraph
};

// Приводит введённый заказчиком адрес к валидному абсолютному URL:
// "svmdom.ru" → "https://svmdom.ru"; мусор → дефолт. Так метаданные не падают.
function normalizeUrl(raw: string | undefined): string {
  let u = (raw ?? "").trim().replace(/\/+$/, "");
  if (!u) return SEO_DEFAULTS.siteUrl;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    new URL(u);
    return u;
  } catch {
    return SEO_DEFAULTS.siteUrl;
  }
}

export function getSeoData(settings: Record<string, string>): SeoData {
  const siteUrl = normalizeUrl(settings.site_url);
  const rawOg = settings.seo_og_image?.trim() || SEO_DEFAULTS.ogImage;
  const ogImage = /^https?:\/\//i.test(rawOg) ? rawOg : `${siteUrl}${rawOg.startsWith("/") ? "" : "/"}${rawOg}`;
  return {
    title: settings.seo_title?.trim() || SEO_DEFAULTS.title,
    description: settings.seo_description?.trim() || SEO_DEFAULTS.description,
    siteName: settings.seo_site_name?.trim() || SEO_DEFAULTS.siteName,
    siteUrl,
    ogImage,
  };
}

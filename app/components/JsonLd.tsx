import { getSettings } from "../lib/queries";
import { getSeoData } from "../lib/seo";
import { SHOW_TELEGRAM } from "../content/landing";

// Микроразметка организации/локального бизнеса (schema.org) для поисковиков —
// помогает показывать компанию в выдаче/картах с телефоном, адресом, часами.
// Данные тянутся из настроек сайта; пустые поля просто опускаются.
function isHttp(u: string | undefined): u is string {
  return !!u && /^https?:\/\//i.test(u);
}

export default async function JsonLd() {
  const s = await getSettings();
  const seo = getSeoData(s);

  // Telegram исключён и отсюда: sameAs — это публичные ссылки на аккаунты компании,
  // которые видят поисковики. Скрывать ссылку в интерфейсе, но отдавать её роботам
  // было бы половинчато. Вернуть = SHOW_TELEGRAM в landing.ts.
  const sameAs = [
    ...(SHOW_TELEGRAM ? [s.telegram_url] : []),
    s.whatsapp_url,
    s.max_url,
  ].filter(isHttp);
  const hours =
    s.work_start && s.work_end
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: s.work_start,
            closes: s.work_end,
          },
        ]
      : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    name: seo.siteName,
    description: seo.description,
    url: seo.siteUrl,
    logo: `${seo.siteUrl}/icon-512.png`,
    image: seo.ogImage,
    telephone: s.phone || undefined,
    foundingDate: "2016",
    areaServed: "Краснодар и населённые пункты в радиусе 70 км",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Краснодар",
      addressRegion: "Краснодарский край",
      addressCountry: "RU",
    },
    geo: { "@type": "GeoCoordinates", latitude: 45.0355, longitude: 38.9753 },
    openingHoursSpecification: hours,
    sameAs: sameAs.length ? sameAs : undefined,
    priceRange: "₽₽",
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify отбрасывает undefined-поля; экранируем "<" на всякий случай.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

import type { Metadata } from "next";
import "./globals.css";
import CookieNotice from "./components/CookieNotice";
import YandexMetrika from "./components/YandexMetrika";
import { getSettings } from "./lib/queries";
import { getSeoData } from "./lib/seo";

// Коды подтверждения прав (Яндекс.Вебмастер / Google Search Console).
// Их может быть НЕСКОЛЬКО: у владельца сайта и у подрядчика — свои коды, а в
// Вебмастере ещё и разные записи (svm93.ru и https://svm93.ru) требуют разных.
// Поэтому в поле админки можно перечислить коды через запятую/пробел/с новой
// строки — на каждый выведется свой мета-тег, и все подтверждения живут разом.
function verificationCodes(raw?: string | null): string[] | undefined {
  const list = (raw ?? "")
    .split(/[\s,;]+/)
    .map((code) => code.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const seo = getSeoData(s);
  return {
    metadataBase: new URL(seo.siteUrl),
    title: { default: seo.title, template: `%s | ${seo.siteName}` },
    description: seo.description,
    applicationName: seo.siteName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: "/",
      siteName: seo.siteName,
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    verification: {
      yandex: verificationCodes(s.yandex_verification),
      google: verificationCodes(s.google_verification),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // getSettings закэширован на запрос — generateMetadata уже его вызвал,
  // повторного обращения к БД здесь не будет.
  const settings = await getSettings();

  return (
    // data-scroll-behavior: globals.css задает scroll-behavior: smooth, Next 15.5+
    // требует пометить это явно, чтобы корректно отключать плавность при роутинге.
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        {children}
        <CookieNotice />
        <YandexMetrika counterId={settings.metrika_id} />
      </body>
    </html>
  );
}

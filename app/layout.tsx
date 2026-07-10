import type { Metadata } from "next";
import "./globals.css";
import CookieNotice from "./components/CookieNotice";
import { getSettings } from "./lib/queries";
import { getSeoData } from "./lib/seo";

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
      yandex: s.yandex_verification?.trim() || undefined,
      google: s.google_verification?.trim() || undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior: globals.css задает scroll-behavior: smooth, Next 15.5+
    // требует пометить это явно, чтобы корректно отключать плавность при роутинге.
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}

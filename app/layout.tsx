import type { Metadata } from "next";
import "./globals.css";
import CookieNotice from "./components/CookieNotice";
import { getSettings } from "./lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: s.seo_title || "Кирпичные дома в Краснодаре | Готовые дома и строительство",
    description:
      s.seo_description ||
      "Готовые кирпичные дома, дома в строительстве и строительство под заказ в Краснодаре и радиусе 70 км.",
    icons: {
      icon: "/logo/svm-logo-mark-cutout.png",
      apple: "/logo/svm-logo-mark-cutout.png",
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

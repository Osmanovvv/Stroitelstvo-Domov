import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Кирпичные дома в Краснодаре | Готовые дома и строительство",
  description:
    "Готовые кирпичные дома, дома в строительстве и строительство под заказ в Краснодаре и радиусе 70 км.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

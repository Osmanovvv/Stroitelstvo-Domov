import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "СВМ — строительство кирпичных домов в Краснодаре",
    short_name: "СВМ",
    description:
      "Готовые дома, объекты в строительстве и строительство под заказ в Краснодаре и радиусе 70 км.",
    start_url: "/",
    display: "browser",
    lang: "ru",
    background_color: "#faf7f1",
    theme_color: "#11182f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}

import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  // Лимиты тела запроса для загрузки фото (sharp потом сожмёт картинку).
  // serverActions — лимит для самого экшена; middlewareClientMaxBodySize —
  // отдельный лимит для запросов, проходящих через middleware (все /admin),
  // по умолчанию всего 10 МБ: без него крупные фото обрезаются и не грузятся.
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
    middlewareClientMaxBodySize: "25mb",
  },
  images: {
    // Оптимизатор next/image не отдаёт файлы, добавленные в public/ ПОСЛЕ
    // сборки (загруженные через админку фото) — он их не находит. Поэтому
    // отдаём картинки как есть: загрузки идёт nginx из /uploads, исходники
    // уже web-размера (Unsplash w=1600, hero webp, sharp-сжатые загрузки).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Базовые заголовки безопасности на все ответы: защита от кликджекинга,
  // MIME-sniffing и утечки реферера. HSTS — только в проде (по HTTPS).
  async headers() {
    // Content-Security-Policy: защита от инъекции скриптов/кликджекинга.
    // 'unsafe-inline' для script/style ОБЯЗАТЕЛЕН: сайт использует инлайн-стили
    // (style={{}}), инлайн JSON-LD и инлайн-скрипты гидратации Next. Без
    // upgrade-insecure-requests — сервер сейчас по HTTP, апгрейд сломал бы ресурсы.
    // NB: при подключении Яндекс.Метрики добавить mc.yandex.ru в script/img/connect.
    // В DEV Next использует eval() для HMR/Fast Refresh — там нужен 'unsafe-eval'.
    // В ПРОДЕ eval нет, поэтому политика строже (без 'unsafe-eval').
    const scriptSrc =
      process.env.NODE_ENV === "production"
        ? "script-src 'self' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      scriptSrc,
      "connect-src 'self'",
    ].join("; ");
    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains",
      });
    }
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

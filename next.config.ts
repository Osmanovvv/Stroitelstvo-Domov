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
    // Оптимизация ВКЛЮЧЕНА. Прежний комментарий («оптимизатор не видит файлы,
    // добавленные в public/ после сборки») оказался неверным — проверено на
    // собранном приложении: файл, положенный в public/uploads уже ПОСЛЕ build,
    // отдаётся через /_next/image нормально. Выигрыш решающий: фото заказчика
    // 678 КБ на телефоне превращается в ~19 КБ (нужная ширина + webp).
    // Без этого страница весила 5.9 МБ, из них ~4 МБ — картинки не по размеру.
    unoptimized: false,
    // По умолчанию оптимизированные картинки отдаются с `max-age=60`: при
    // повторном заходе браузер перепроверяет все ~25 фото заново. Ставим год —
    // ссылка на оптимизатор включает путь исходника, а файлы в /uploads имеют
    // уникальные имена по времени загрузки, так что подмены «того же URL» не будет.
    minimumCacheTTL: 31536000,
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
    // В DEV Next использует eval() для HMR/Fast Refresh — там нужен 'unsafe-eval'.
    // В ПРОДЕ eval нет, поэтому политика строже (без 'unsafe-eval').
    // METRIKA: счётчик грузится с mc.yandex.ru и туда же шлёт данные, Вебвизор
    // дополнительно поднимает iframe и worker из blob — отсюда домены Яндекса в
    // script/connect/frame и worker-src с blob. Картинки покрыты `https:` в img-src.
    const METRIKA = "https://mc.yandex.ru https://mc.yandex.com https://yastatic.net";
    // Вебвизор держит WebSocket — без wss он ругается в консоли и теряет записи.
    const METRIKA_CONNECT = `${METRIKA} wss://mc.yandex.ru wss://mc.yandex.com`;
    const scriptSrc =
      process.env.NODE_ENV === "production"
        ? `script-src 'self' 'unsafe-inline' ${METRIKA}`
        : `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${METRIKA}`;
    const cspDirectives = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      scriptSrc,
      `connect-src 'self' ${METRIKA_CONNECT}`,
      `frame-src 'self' ${METRIKA}`,
      "worker-src 'self' blob:",
    ];
    // Сайт на HTTPS (боевой домен): просим браузер апгрейдить любые http-подресурсы
    // до https. Только в проде — в DEV сервер по http, апгрейд мешал бы локалке.
    if (process.env.NODE_ENV === "production") {
      cspDirectives.push("upgrade-insecure-requests");
    }
    const csp = cspDirectives.join("; ");
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

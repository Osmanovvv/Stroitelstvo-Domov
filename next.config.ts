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
    const securityHeaders = [
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

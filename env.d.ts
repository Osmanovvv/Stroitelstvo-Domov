// Типизация переменных окружения проекта. Секреты помечены опциональными,
// т.к. код обоснованно проверяет их наличие (session.ts throw, auth.ts guard,
// telegram.ts telegramConfigured) — тип должен отражать необходимость проверки.
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AUTH_SECRET?: string;
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD_HASH?: string;
    TELEGRAM_BOT_TOKEN?: string;
    TELEGRAM_CHAT_ID?: string;
    ALLOW_INSECURE_COOKIES?: string;
  }
}

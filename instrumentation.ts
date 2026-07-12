// Валидация окружения при старте сервера (Next вызывает register() один раз).
// Не бросаем (чтобы не ронять публичный сайт из-за отсутствующего admin-секрета),
// но пишем ПОНЯТНЫЕ сообщения в лог PM2 — вместо cryptic 500 при входе в админку.
export async function register(): Promise<void> {
  const required = ["DATABASE_URL", "AUTH_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD_HASH"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `[env] ОТСУТСТВУЮТ обязательные переменные: ${missing.join(", ")}. ` +
        "Вход в админку и сессии работать не будут — задайте их в .env.production.",
    );
  }
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn(
      "[env] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы — заявки будут сохраняться " +
        "в БД, но НЕ отправятся в Telegram (проверьте /admin/leads на notifyError).",
    );
  }
}

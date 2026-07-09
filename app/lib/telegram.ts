// Отправка уведомлений о заявках в Telegram с повторными попытками.
// Токен и chat_id берутся из окружения (не хранятся в коде). Заявка сохраняется
// в БД ДО отправки, поэтому даже полный отказ Telegram не теряет лид (leadActions).

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function telegramConfigured(): boolean {
  return Boolean(TOKEN && CHAT_ID);
}

// Паузы между попытками, мс. Итого 5 попыток (0 + 4 повтора) с нарастающей паузой —
// переживает сетевые всплески/таймауты, из-за которых «один раз не доходило».
const RETRY_DELAYS = [400, 1200, 3000, 6000];
const ATTEMPT_TIMEOUT_MS = 15000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < RETRY_DELAYS.length) await sleep(RETRY_DELAYS[attempt]);
    }
  }
  throw new Error(
    `Telegram ${label}: не удалось после ${RETRY_DELAYS.length + 1} попыток — ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}

async function tgFetch(method: string, init: RequestInit): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      ...init,
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; description?: string } | null;
    if (!res.ok || !data || data.ok !== true) {
      throw new Error(data?.description || `HTTP ${res.status}`);
    }
  } finally {
    clearTimeout(timer);
  }
}

export async function sendTelegramMessage(text: string): Promise<void> {
  if (!telegramConfigured()) throw new Error("Telegram не настроен (нет TELEGRAM_BOT_TOKEN/CHAT_ID)");
  await withRetry("sendMessage", () =>
    tgFetch("sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    }),
  );
}

export async function sendTelegramDocument(
  buffer: Buffer,
  filename: string,
  caption?: string,
): Promise<void> {
  if (!telegramConfigured()) throw new Error("Telegram не настроен");
  await withRetry("sendDocument", () => {
    const form = new FormData();
    form.append("chat_id", String(CHAT_ID));
    if (caption) form.append("caption", caption);
    form.append("document", new Blob([new Uint8Array(buffer)]), filename);
    return tgFetch("sendDocument", { method: "POST", body: form });
  });
}

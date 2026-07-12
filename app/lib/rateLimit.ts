// Простой лимитер частоты в памяти процесса (один инстанс PM2). Для защиты
// публичной формы заявок от ботов/флуда. Без внешних зависимостей; при
// нескольких инстансах заменить на Redis. Возвращает true = запрос разрешён.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let lastSweep = 0;

function sweep(now: number): void {
  // Раз в минуту чистим протухшие корзины, чтобы Map не рос бесконечно.
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

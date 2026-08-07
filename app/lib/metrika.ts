// Отправка цели в Яндекс.Метрику из клиентских компонентов.
//
// `ym` может отсутствовать — счётчик ещё не догрузился, его срезал блокировщик
// рекламы или страница открыта в /admin, где счётчика нет вовсе. В этом случае
// молча выходим: аналитика никогда не должна ронять интерфейс, поэтому всё
// обёрнуто в try/catch.
//
// Цели, на которые опирается Директ (проверены вживую 2026-08-07):
//   lead      — заявка отправлена и принята сервером. Вызывается ТОЛЬКО после
//               успешного submitLead, из всех трёх форм: модалка, квиз, контакты.
//   phone     — клик по ссылке tel:
//   messenger — клик по ссылке на WhatsApp / Telegram / MAX
// Первая — главная бизнес-цель, на неё и оптимизируем рекламу. Две другие —
// вспомогательные: клик по номеру ещё не заявка, но сигнал намерения.
declare global {
  interface Window {
    ym?: (counterId: number, action: string, ...args: unknown[]) => void;
    __ymCounterId?: number;
  }
}

export function reachGoal(goal: string): void {
  if (typeof window === "undefined") return;
  const counterId = window.__ymCounterId;
  if (!counterId || typeof window.ym !== "function") return;
  try {
    window.ym(counterId, "reachGoal", goal);
  } catch {
    // Метрика недоступна (блокировщик, сбой сети) — это не повод ломать форму.
  }
}

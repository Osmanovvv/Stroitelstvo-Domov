// Отправка цели в Яндекс.Метрику из клиентских компонентов.
//
// Счётчик подключается ТОЛЬКО после согласия на cookie (см. YandexMetrika),
// поэтому `ym` может отсутствовать — в этом случае молча выходим. Аналитика
// никогда не должна ронять интерфейс, поэтому всё обёрнуто в try/catch.
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

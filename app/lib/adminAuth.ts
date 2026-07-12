import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

// Проверка сессии администратора. ОБЯЗАТЕЛЬНО вызывать первой строкой в КАЖДОМ
// мутационном server action админки (и в layout панели как второй слой).
// Причина: middleware защищает только ЗАГРУЗКУ страниц /admin (по матчеру), а
// server actions диспатчатся по action-id и НЕ проходят матчер /admin/* при
// POST на публичный путь (напр. «/»). Без этой проверки экшены админки можно
// вызвать без входа. Публичный submitLead намеренно НЕ защищаем.
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    throw new Error("Требуется вход в админку.");
  }
}

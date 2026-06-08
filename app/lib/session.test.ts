import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken } from "./session";

// Тестовый секрет (если не задан в окружении) — нужен для подписи/проверки токенов.
// session.ts читает AUTH_SECRET лениво (внутри функций), поэтому установки здесь достаточно.
process.env.AUTH_SECRET ||= "test-only-secret-string-at-least-32-bytes";

test("valid token round-trips and returns subject", async () => {
  const token = await createSessionToken("admin");
  const payload = await verifySessionToken(token);
  assert.equal(payload?.sub, "admin");
});

test("tampered token is rejected", async () => {
  const token = await createSessionToken("admin");
  const payload = await verifySessionToken(token + "x");
  assert.equal(payload, null);
});

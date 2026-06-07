import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken } from "./session";

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

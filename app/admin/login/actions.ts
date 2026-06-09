"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "@/app/lib/auth";
import { createSessionToken, SESSION_COOKIE } from "@/app/lib/session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const ok = await verifyCredentials(username, password);
  if (!ok) {
    return { error: "Неверный логин или пароль" };
  }

  const token = await createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    // Secure включён в проде (HTTPS). Для тестового демо по HTTP его можно
    // отключить переменной ALLOW_INSECURE_COOKIES=1, иначе браузер по HTTP
    // не сохранит cookie и вход «не залогинивается».
    secure: process.env.NODE_ENV === "production" && process.env.ALLOW_INSECURE_COOKIES !== "1",
  });

  redirect("/admin");
}

"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card admin-form" action={action}>
        <h1>Вход в админку</h1>
        <div className="admin-field">
          <label htmlFor="username">Логин</label>
          <input id="username" name="username" type="text" autoComplete="username" required />
        </div>
        <div className="admin-field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state.error && <p className="admin-error">{state.error}</p>}
        <button className="admin-btn primary" type="submit" disabled={pending}>
          {pending ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";

// Граница ошибок для страниц (рендерится в разметке root-layout при исключении
// в серверном/клиентском компоненте). Не даёт посетителю увидеть голый экран.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "72vh", display: "grid", placeItems: "center", padding: "48px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontSize: 26, margin: "0 0 12px", color: "#11182f" }}>Что-то пошло не так</h1>
        <p style={{ color: "#5b6472", marginBottom: 24 }}>
          Попробуйте обновить страницу. Если не помогло — позвоните нам, и мы всё уладим.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="button primary" type="button" onClick={() => reset()}>
            Обновить
          </button>
          <Link className="button" href="/" style={{ border: "1px solid var(--line)" }}>
            На главную
          </Link>
        </div>
      </div>
    </main>
  );
}

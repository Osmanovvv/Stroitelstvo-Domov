"use client";

// Граница ошибок САМОГО root-layout (когда падает layout). Заменяет всю
// разметку, поэтому обязана содержать <html>/<body> и собственные стили
// (globals.css здесь может не подгрузиться).
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", background: "#faf7f1", color: "#11182f" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "48px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontSize: 26, margin: "0 0 12px" }}>Что-то пошло не так</h1>
            <p style={{ color: "#5b6472", marginBottom: 24 }}>Пожалуйста, обновите страницу.</p>
            <button
              type="button"
              onClick={() => reset()}
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#3447a8", color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              Обновить страницу
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

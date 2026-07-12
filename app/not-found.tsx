import Link from "next/link";
import { getSettings } from "./lib/queries";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  const s = await getSettings();
  const phone = s.phone || "";
  return (
    <main style={{ minHeight: "72vh", display: "grid", placeItems: "center", padding: "48px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: 520 }}>
        <p style={{ fontSize: 72, fontWeight: 800, color: "#11182f", margin: 0, lineHeight: 1 }}>404</p>
        <h1 style={{ fontSize: 26, margin: "10px 0 12px", color: "#11182f" }}>Страница не найдена</h1>
        <p style={{ color: "#5b6472", marginBottom: 24 }}>
          Возможно, ссылка устарела или введена с ошибкой. Вернитесь на главную или позвоните — поможем.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="button primary" href="/">На главную</Link>
          {phone && (
            <a className="button" href={`tel:${phone}`} style={{ border: "1px solid var(--line)" }}>
              {phone}
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

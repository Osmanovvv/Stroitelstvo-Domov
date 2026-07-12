import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "../logout/actions";
import AdminNav from "./AdminNav";
import ToastViewport from "@/app/admin/components/Toast";
import { SESSION_COOKIE, verifySessionToken } from "@/app/lib/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Второй слой авторизации помимо middleware (defense-in-depth): при любом
  // обходе middleware страница админки всё равно не отрендерится без сессии.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <ToastViewport />
      <aside className="admin-sidebar">
        <h1>Админка сайта</h1>
        <AdminNav />
        <div className="admin-sidebar-footer">
          <a className="admin-site-link" href="/" target="_blank" rel="noreferrer">
            ↗ Открыть сайт
          </a>
          <form action={logout}>
            <button className="admin-btn" type="submit">Выйти</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

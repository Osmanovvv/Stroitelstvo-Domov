import { logout } from "../logout/actions";
import AdminNav from "./AdminNav";
import ToastViewport from "@/app/admin/components/Toast";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
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

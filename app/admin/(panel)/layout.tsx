import Link from "next/link";
import { logout } from "../logout/actions";

const sections = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/homes", label: "Готовые дома" },
  { href: "/admin/building", label: "Дома в строительстве" },
  { href: "/admin/projects", label: "Проекты" },
  { href: "/admin/plots", label: "Участки" },
  { href: "/admin/prices", label: "Цены и комплектации" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/settings", label: "Настройки сайта" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h1>Админка сайта</h1>
        <nav className="admin-nav">
          {sections.map((s) => (
            <Link key={s.href} href={s.href}>
              {s.label}
            </Link>
          ))}
        </nav>
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

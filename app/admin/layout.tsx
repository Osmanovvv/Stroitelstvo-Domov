import Link from "next/link";
import "./admin.css";
import { logout } from "./logout/actions";

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h1>Админка сайта</h1>
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            {s.label}
          </Link>
        ))}
        <form action={logout} style={{ marginTop: "auto", paddingTop: 16 }}>
          <button className="admin-btn" type="submit">Выйти</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

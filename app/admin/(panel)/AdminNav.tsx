"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin/hero", label: "Главный экран" },
  { href: "/admin/choice", label: "Блок выбора" },
  { href: "/admin/homes", label: "Готовые дома" },
  { href: "/admin/building", label: "Дома в строительстве" },
  { href: "/admin/projects", label: "Проекты" },
  { href: "/admin/plots", label: "Участки" },
  { href: "/admin/built", label: "Построенные объекты" },
  { href: "/admin/prices", label: "Цены и комплектации" },
  { href: "/admin/compare", label: "Дом или квартира" },
  { href: "/admin/calc", label: "Подбор и расчёт" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/legal", label: "Юр. документы" },
  { href: "/admin/settings", label: "Настройки сайта" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav">
      {sections.map((s) => {
        const active =
          s.href === "/admin"
            ? pathname === "/admin"
            : pathname === s.href || pathname.startsWith(`${s.href}/`);

        return (
          <Link
            key={s.href}
            href={s.href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}

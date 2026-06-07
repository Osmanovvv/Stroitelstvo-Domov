import Link from "next/link";
import { prisma } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [homes, building, projects, plots, prices, faq] = await Promise.all([
    prisma.readyHome.count(),
    prisma.buildingHome.count(),
    prisma.project.count(),
    prisma.plot.count(),
    prisma.priceRow.count(),
    prisma.faqItem.count(),
  ]);

  const cards = [
    { href: "/admin/homes", label: "Готовые дома", value: homes },
    { href: "/admin/building", label: "Дома в строительстве", value: building },
    { href: "/admin/projects", label: "Проекты", value: projects },
    { href: "/admin/plots", label: "Участки", value: plots },
    { href: "/admin/prices", label: "Строк в таблице цен", value: prices },
    { href: "/admin/faq", label: "Вопросов в FAQ", value: faq },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h2>Дашборд</h2>
      </div>
      <div className="admin-dashboard-grid">
        {cards.map((c) => (
          <Link key={c.href} className="admin-card admin-dash-card" href={c.href}>
            <strong>{c.value}</strong>
            {c.label}
          </Link>
        ))}
      </div>
    </>
  );
}

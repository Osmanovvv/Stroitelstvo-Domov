import Link from "next/link";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deleteBuilding, toggleBuilding, moveBuilding } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuildingAdmin() {
  const items = await prisma.buildingHome.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Дома в строительстве</h2>
        <Link className="admin-btn primary" href="/admin/building/new">Добавить</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Название</th><th>Этап</th><th>Срок</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.title}
                  {!item.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{item.stage}</td>
                <td>{item.finish}</td>
                <td>
                  <RowActions
                    editHref={`/admin/building/${item.id}`}
                    id={item.id}
                    isVisible={item.isVisible}
                    toggleAction={toggleBuilding}
                    moveAction={moveBuilding}
                    deleteAction={deleteBuilding}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

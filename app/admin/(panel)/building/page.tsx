import Link from "next/link";
import { prisma } from "@/app/lib/db";
import SortableList, { type SortableItem } from "@/app/admin/components/SortableList";
import { deleteBuilding, toggleBuilding, moveBuilding } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuildingAdmin() {
  const buildings = await prisma.buildingHome.findMany({ orderBy: { sortOrder: "asc" } });
  const items: SortableItem[] = buildings.map((b) => ({
    id: b.id,
    isVisible: b.isVisible,
    editHref: `/admin/building/${b.id}`,
    cells: [
      { kind: "title", value: b.title },
      { kind: "text", value: b.stage },
      { kind: "text", value: b.finish },
    ],
  }));

  return (
    <>
      <div className="admin-topbar">
        <h2>Дома в строительстве</h2>
        <Link className="admin-btn primary" href="/admin/building/new">Добавить</Link>
      </div>
      <div className="admin-card">
        <SortableList
          headers={["Название", "Этап", "Срок"]}
          items={items}
          move={moveBuilding}
          toggle={toggleBuilding}
          remove={deleteBuilding}
        />
      </div>
    </>
  );
}

import Link from "next/link";
import { prisma } from "@/app/lib/db";
import SortableList, { type SortableItem } from "@/app/admin/components/SortableList";
import { deletePlot, togglePlot, movePlot } from "./actions";

export const dynamic = "force-dynamic";

export default async function PlotsAdmin() {
  const plots = await prisma.plot.findMany({ orderBy: { sortOrder: "asc" } });
  const items: SortableItem[] = plots.map((p) => ({
    id: p.id,
    isVisible: p.isVisible,
    editHref: `/admin/plots/${p.id}`,
    cells: [
      { kind: "title", value: p.title },
      { kind: "text", value: p.area },
      { kind: "text", value: p.location },
    ],
  }));

  return (
    <>
      <div className="admin-topbar">
        <h2>Участки</h2>
        <Link className="admin-btn primary" href="/admin/plots/new">Добавить участок</Link>
      </div>
      <div className="admin-card">
        <SortableList
          headers={["Название", "Площадь", "Локация"]}
          items={items}
          move={movePlot}
          toggle={togglePlot}
          remove={deletePlot}
        />
      </div>
    </>
  );
}

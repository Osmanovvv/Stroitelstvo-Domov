import Link from "next/link";
import { prisma } from "@/app/lib/db";
import SortableList, { type SortableItem } from "@/app/admin/components/SortableList";
import { deleteHome, toggleHome, moveHome } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomesAdmin() {
  const homes = await prisma.readyHome.findMany({ orderBy: { sortOrder: "asc" } });
  const items: SortableItem[] = homes.map((h) => ({
    id: h.id,
    isVisible: h.isVisible,
    editHref: `/admin/homes/${h.id}`,
    cells: [
      { kind: "image", src: h.image },
      { kind: "title", value: h.title },
      { kind: "text", value: h.price },
      { kind: "text", value: h.status },
    ],
  }));

  return (
    <>
      <div className="admin-topbar">
        <h2>Готовые дома</h2>
        <Link className="admin-btn primary" href="/admin/homes/new">Добавить дом</Link>
      </div>
      <div className="admin-card">
        <SortableList
          headers={["Фото", "Название", "Цена", "Статус"]}
          items={items}
          move={moveHome}
          toggle={toggleHome}
          remove={deleteHome}
        />
      </div>
    </>
  );
}

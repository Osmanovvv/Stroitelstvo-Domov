import Link from "next/link";
import { prisma } from "@/app/lib/db";
import SortableList, { type SortableItem } from "@/app/admin/components/SortableList";
import { deleteProject, toggleProject, moveProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  const items: SortableItem[] = projects.map((p) => ({
    id: p.id,
    isVisible: p.isVisible,
    editHref: `/admin/projects/${p.id}`,
    cells: [
      { kind: "image", src: p.image },
      { kind: "title", value: p.name },
      { kind: "text", value: p.area },
      { kind: "text", value: p.price },
    ],
  }));

  return (
    <>
      <div className="admin-topbar">
        <h2>Проекты</h2>
        <Link className="admin-btn primary" href="/admin/projects/new">Добавить проект</Link>
      </div>
      <div className="admin-card">
        <SortableList
          headers={["Фото", "Название", "Площадь", "Цена"]}
          items={items}
          move={moveProject}
          toggle={toggleProject}
          remove={deleteProject}
        />
      </div>
    </>
  );
}

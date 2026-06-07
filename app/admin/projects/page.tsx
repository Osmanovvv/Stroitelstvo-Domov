import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deleteProject, toggleProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Проекты</h2>
        <Link className="admin-btn primary" href="/admin/projects/new">Добавить проект</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Фото</th><th>Название</th><th>Площадь</th><th>Цена</th><th></th></tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.image && <Image src={project.image} alt="" width={64} height={44} />}</td>
                <td>
                  {project.name}
                  {!project.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{project.area}</td>
                <td>{project.price}</td>
                <td>
                  <RowActions
                    editHref={`/admin/projects/${project.id}`}
                    id={project.id}
                    isVisible={project.isVisible}
                    toggleAction={toggleProject}
                    deleteAction={deleteProject}
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

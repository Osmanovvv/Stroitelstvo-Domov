import Link from "next/link";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deletePlot, togglePlot, movePlot } from "./actions";

export const dynamic = "force-dynamic";

export default async function PlotsAdmin() {
  const plots = await prisma.plot.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Участки</h2>
        <Link className="admin-btn primary" href="/admin/plots/new">Добавить участок</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Название</th><th>Площадь</th><th>Локация</th><th></th></tr>
          </thead>
          <tbody>
            {plots.map((plot) => (
              <tr key={plot.id}>
                <td>
                  {plot.title}
                  {!plot.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{plot.area}</td>
                <td>{plot.location}</td>
                <td>
                  <RowActions
                    editHref={`/admin/plots/${plot.id}`}
                    id={plot.id}
                    isVisible={plot.isVisible}
                    toggleAction={togglePlot}
                    moveAction={movePlot}
                    deleteAction={deletePlot}
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

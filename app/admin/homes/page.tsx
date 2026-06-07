import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/db";
import RowActions from "@/app/admin/components/RowActions";
import { deleteHome, toggleHome } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomesAdmin() {
  const homes = await prisma.readyHome.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar">
        <h2>Готовые дома</h2>
        <Link className="admin-btn primary" href="/admin/homes/new">Добавить дом</Link>
      </div>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Фото</th><th>Название</th><th>Цена</th><th>Статус</th><th></th></tr>
          </thead>
          <tbody>
            {homes.map((home) => (
              <tr key={home.id}>
                <td>{home.image && <Image src={home.image} alt="" width={64} height={44} />}</td>
                <td>
                  {home.title}
                  {!home.isVisible && <div className="admin-hidden-badge">скрыто</div>}
                </td>
                <td>{home.price}</td>
                <td>{home.status}</td>
                <td>
                  <RowActions
                    editHref={`/admin/homes/${home.id}`}
                    id={home.id}
                    isVisible={home.isVisible}
                    toggleAction={toggleHome}
                    deleteAction={deleteHome}
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

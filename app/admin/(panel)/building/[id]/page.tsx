import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import BuildingForm from "../BuildingForm";
import { updateBuilding } from "../actions";

export default async function EditBuilding({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.buildingHome.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование объекта</h2></div>
      <div className="admin-card">
        <BuildingForm action={updateBuilding} item={item} />
      </div>
    </>
  );
}

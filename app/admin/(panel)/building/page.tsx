import { prisma } from "@/app/lib/db";
import ResourceManager from "@/app/admin/components/ResourceManager";
import { columns, fields, hasImage, extraImageFields, toRecord } from "./config";
import { createBuilding, updateBuilding, deleteBuilding, toggleBuilding, moveBuilding } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuildingAdmin() {
  const buildings = await prisma.buildingHome.findMany({ orderBy: { sortOrder: "asc" } });
  const items = buildings.map(toRecord);

  return (
    <ResourceManager
      title="Дома в строительстве"
      addLabel="Добавить"
      hasImage={hasImage}
      extraImageFields={extraImageFields}
      columns={columns}
      fields={fields}
      items={items}
      create={createBuilding}
      update={updateBuilding}
      remove={deleteBuilding}
      toggle={toggleBuilding}
      move={moveBuilding}
    />
  );
}

import { prisma } from "@/app/lib/db";
import ResourceManager from "@/app/admin/components/ResourceManager";
import { columns, fields, hasImage, extraImageFields, toRecord } from "./config";
import { createBuilt, updateBuilt, deleteBuilt, toggleBuilt, moveBuilt } from "./actions";

export const dynamic = "force-dynamic";

export default async function BuiltAdmin() {
  const objects = await prisma.builtObject.findMany({ orderBy: { sortOrder: "asc" } });
  const items = objects.map(toRecord);

  return (
    <ResourceManager
      title="Построенные объекты"
      addLabel="Добавить объект"
      hasImage={hasImage}
      extraImageFields={extraImageFields}
      columns={columns}
      fields={fields}
      items={items}
      create={createBuilt}
      update={updateBuilt}
      remove={deleteBuilt}
      toggle={toggleBuilt}
      move={moveBuilt}
    />
  );
}

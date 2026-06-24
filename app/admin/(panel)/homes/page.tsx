import { prisma } from "@/app/lib/db";
import ResourceManager from "@/app/admin/components/ResourceManager";
import { columns, fields, hasImage, extraImageFields, toRecord } from "./config";
import { createHome, updateHome, deleteHome, toggleHome, moveHome } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomesAdmin() {
  const homes = await prisma.readyHome.findMany({ orderBy: { sortOrder: "asc" } });
  const items = homes.map(toRecord);

  return (
    <ResourceManager
      title="Готовые дома"
      addLabel="Добавить дом"
      hasImage={hasImage}
      extraImageFields={extraImageFields}
      columns={columns}
      fields={fields}
      items={items}
      create={createHome}
      update={updateHome}
      remove={deleteHome}
      toggle={toggleHome}
      move={moveHome}
    />
  );
}

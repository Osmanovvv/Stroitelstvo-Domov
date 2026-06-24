import { prisma } from "@/app/lib/db";
import ResourceManager from "@/app/admin/components/ResourceManager";
import { columns, fields, hasImage, extraImageFields, toRecord } from "./config";
import { createPlot, updatePlot, deletePlot, togglePlot, movePlot } from "./actions";

export const dynamic = "force-dynamic";

export default async function PlotsAdmin() {
  const plots = await prisma.plot.findMany({ orderBy: { sortOrder: "asc" } });
  const items = plots.map(toRecord);

  return (
    <ResourceManager
      title="Участки"
      addLabel="Добавить участок"
      hasImage={hasImage}
      extraImageFields={extraImageFields}
      columns={columns}
      fields={fields}
      items={items}
      create={createPlot}
      update={updatePlot}
      remove={deletePlot}
      toggle={togglePlot}
      move={movePlot}
    />
  );
}

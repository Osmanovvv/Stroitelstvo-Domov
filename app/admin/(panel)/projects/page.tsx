import { prisma } from "@/app/lib/db";
import ResourceManager from "@/app/admin/components/ResourceManager";
import { columns, fields, hasImage, extraImageFields, toRecord } from "./config";
import { createProject, updateProject, deleteProject, toggleProject, moveProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  const items = projects.map(toRecord);

  return (
    <ResourceManager
      title="Проекты"
      addLabel="Добавить проект"
      hasImage={hasImage}
      extraImageFields={extraImageFields}
      columns={columns}
      fields={fields}
      items={items}
      create={createProject}
      update={updateProject}
      remove={deleteProject}
      toggle={toggleProject}
      move={moveProject}
    />
  );
}

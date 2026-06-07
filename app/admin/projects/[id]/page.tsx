import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import ProjectForm from "../ProjectForm";
import { updateProject } from "../actions";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование проекта</h2></div>
      <div className="admin-card">
        <ProjectForm action={updateProject} project={project} />
      </div>
    </>
  );
}

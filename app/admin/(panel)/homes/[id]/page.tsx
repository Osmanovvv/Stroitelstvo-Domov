import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import HomeForm from "../HomeForm";
import { updateHome } from "../actions";

export default async function EditHome({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const home = await prisma.readyHome.findUnique({ where: { id } });
  if (!home) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование дома</h2></div>
      <div className="admin-card">
        <HomeForm action={updateHome} home={home} />
      </div>
    </>
  );
}

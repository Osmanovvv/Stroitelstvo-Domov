import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/db";
import PlotForm from "../PlotForm";
import { updatePlot } from "../actions";

export default async function EditPlot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plot = await prisma.plot.findUnique({ where: { id } });
  if (!plot) notFound();

  return (
    <>
      <div className="admin-topbar"><h2>Редактирование участка</h2></div>
      <div className="admin-card">
        <PlotForm action={updatePlot} plot={plot} />
      </div>
    </>
  );
}

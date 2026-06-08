"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/plots");
}

function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    area: str(formData, "area"),
    utilities: str(formData, "utilities"),
    location: str(formData, "location"),
  };
}

export async function createPlot(formData: FormData) {
  const max = await prisma.plot.aggregate({ _max: { sortOrder: true } });
  await prisma.plot.create({
    data: { ...readData(formData), sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidate();
  redirect("/admin/plots");
}

export async function updatePlot(formData: FormData) {
  await prisma.plot.update({ where: { id: str(formData, "id") }, data: readData(formData) });
  revalidate();
  redirect("/admin/plots");
}

export async function deletePlot(formData: FormData) {
  await prisma.plot.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function togglePlot(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.plot.findUnique({ where: { id } });
  if (current) {
    await prisma.plot.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}

export async function movePlot(formData: FormData) {
  const id = str(formData, "id");
  const up = str(formData, "direction") === "up";
  const current = await prisma.plot.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.plot.findFirst({
    where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: up ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.plot.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } });
  await prisma.plot.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } });
  revalidate();
}

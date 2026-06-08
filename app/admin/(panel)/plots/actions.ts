"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { toRecord } from "./config";

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
  const plot = await prisma.plot.create({
    data: { ...readData(formData), sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidatePath("/");
  return toRecord(plot);
}

export async function updatePlot(formData: FormData) {
  const plot = await prisma.plot.update({
    where: { id: str(formData, "id") },
    data: readData(formData),
  });
  revalidatePath("/");
  return toRecord(plot);
}

export async function deletePlot(id: string) {
  await prisma.plot.delete({ where: { id } });
  revalidatePath("/");
}

export async function togglePlot(id: string) {
  const current = await prisma.plot.findUnique({ where: { id } });
  if (!current) return;
  await prisma.plot.update({ where: { id }, data: { isVisible: !current.isVisible } });
  revalidatePath("/");
}

export async function movePlot(id: string, direction: "up" | "down") {
  const up = direction === "up";
  const current = await prisma.plot.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.plot.findFirst({
    where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: up ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.plot.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } });
  await prisma.plot.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } });
  revalidatePath("/");
}

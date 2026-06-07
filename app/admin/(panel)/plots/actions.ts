"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";

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
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createPlot(formData: FormData) {
  await prisma.plot.create({ data: readData(formData) });
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

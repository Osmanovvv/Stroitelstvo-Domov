"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/building");
}

function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    stage: str(formData, "stage"),
    finish: str(formData, "finish"),
    location: str(formData, "location"),
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createBuilding(formData: FormData) {
  await prisma.buildingHome.create({ data: readData(formData) });
  revalidate();
  redirect("/admin/building");
}

export async function updateBuilding(formData: FormData) {
  await prisma.buildingHome.update({ where: { id: str(formData, "id") }, data: readData(formData) });
  revalidate();
  redirect("/admin/building");
}

export async function deleteBuilding(formData: FormData) {
  await prisma.buildingHome.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function toggleBuilding(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.buildingHome.findUnique({ where: { id } });
  if (current) {
    await prisma.buildingHome.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}

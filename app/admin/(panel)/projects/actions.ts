"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

async function readData(formData: FormData) {
  const image = await saveUploadedImage(
    formData.get("imageFile") as File | null,
    str(formData, "imageExisting"),
  );
  return {
    name: str(formData, "name"),
    area: str(formData, "area"),
    floors: str(formData, "floors"),
    price: str(formData, "price"),
    time: str(formData, "time"),
    tag: str(formData, "tag"),
    description: str(formData, "description"),
    image,
  };
}

export async function createProject(formData: FormData) {
  const data = await readData(formData);
  const max = await prisma.project.aggregate({ _max: { sortOrder: true } });
  await prisma.project.create({
    data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidate();
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData) {
  await prisma.project.update({ where: { id: str(formData, "id") }, data: await readData(formData) });
  revalidate();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await prisma.project.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function toggleProject(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.project.findUnique({ where: { id } });
  if (current) {
    await prisma.project.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}

export async function moveProject(formData: FormData) {
  const id = str(formData, "id");
  const up = str(formData, "direction") === "up";
  const current = await prisma.project.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.project.findFirst({
    where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: up ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.project.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } });
  await prisma.project.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } });
  revalidate();
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";
import { toRecord } from "./config";

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
  const project = await prisma.project.create({
    data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidatePath("/");
  return toRecord(project);
}

export async function updateProject(formData: FormData) {
  const project = await prisma.project.update({
    where: { id: str(formData, "id") },
    data: await readData(formData),
  });
  revalidatePath("/");
  return toRecord(project);
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleProject(id: string) {
  const current = await prisma.project.findUnique({ where: { id } });
  if (!current) return;
  await prisma.project.update({ where: { id }, data: { isVisible: !current.isVisible } });
  revalidatePath("/");
}

export async function moveProject(id: string, direction: "up" | "down") {
  const up = direction === "up";
  const current = await prisma.project.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.project.findFirst({
    where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: up ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.project.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } });
  await prisma.project.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } });
  revalidatePath("/");
}

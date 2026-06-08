"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { toRecord } from "./config";

function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    stage: str(formData, "stage"),
    finish: str(formData, "finish"),
    location: str(formData, "location"),
  };
}

export async function createBuilding(formData: FormData) {
  const max = await prisma.buildingHome.aggregate({ _max: { sortOrder: true } });
  const item = await prisma.buildingHome.create({
    data: { ...readData(formData), sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidatePath("/");
  return toRecord(item);
}

export async function updateBuilding(formData: FormData) {
  const item = await prisma.buildingHome.update({
    where: { id: str(formData, "id") },
    data: readData(formData),
  });
  revalidatePath("/");
  return toRecord(item);
}

export async function deleteBuilding(id: string) {
  await prisma.buildingHome.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleBuilding(id: string) {
  const current = await prisma.buildingHome.findUnique({ where: { id } });
  if (!current) return;
  await prisma.buildingHome.update({ where: { id }, data: { isVisible: !current.isVisible } });
  revalidatePath("/");
}

export async function moveBuilding(id: string, direction: "up" | "down") {
  const up = direction === "up";
  const current = await prisma.buildingHome.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.buildingHome.findFirst({
    where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: up ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.$transaction([
    prisma.buildingHome.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.buildingHome.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  revalidatePath("/");
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { saveUploadedImage, deleteUploadedImage } from "@/app/lib/upload";
import { toRecord } from "./config";

async function readData(formData: FormData) {
  const image = await saveUploadedImage(
    formData.get("imageFile") as File | null,
    str(formData, "imageExisting"),
  );
  return {
    title: str(formData, "title"),
    price: str(formData, "price"),
    area: str(formData, "area"),
    land: str(formData, "land"),
    rooms: str(formData, "rooms"),
    baths: str(formData, "baths"),
    location: str(formData, "location"),
    status: str(formData, "status"),
    image,
  };
}

export async function createHome(formData: FormData) {
  const data = await readData(formData);
  if (!data.image) throw new Error("Добавьте фото");
  const max = await prisma.readyHome.aggregate({ _max: { sortOrder: true } });
  const home = await prisma.readyHome.create({
    data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidatePath("/");
  return toRecord(home);
}

export async function updateHome(formData: FormData) {
  const data = await readData(formData);
  if (!data.image) throw new Error("Добавьте фото");
  const home = await prisma.readyHome.update({ where: { id: str(formData, "id") }, data });
  revalidatePath("/");
  return toRecord(home);
}

export async function deleteHome(id: string) {
  const home = await prisma.readyHome.findUnique({ where: { id } });
  await prisma.readyHome.delete({ where: { id } });
  await deleteUploadedImage(home?.image);
  revalidatePath("/");
}

export async function toggleHome(id: string) {
  const current = await prisma.readyHome.findUnique({ where: { id } });
  if (!current) return;
  await prisma.readyHome.update({ where: { id }, data: { isVisible: !current.isVisible } });
  revalidatePath("/");
}

export async function moveHome(id: string, direction: "up" | "down") {
  const up = direction === "up";
  const current = await prisma.readyHome.findUnique({ where: { id } });
  if (!current) return;
  const neighbor = await prisma.readyHome.findFirst({
    where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: up ? "desc" : "asc" },
  });
  if (!neighbor) return;
  await prisma.$transaction([
    prisma.readyHome.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.readyHome.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);
  revalidatePath("/");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/homes");
}

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
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createHome(formData: FormData) {
  await prisma.readyHome.create({ data: await readData(formData) });
  revalidate();
  redirect("/admin/homes");
}

export async function updateHome(formData: FormData) {
  const id = str(formData, "id");
  await prisma.readyHome.update({ where: { id }, data: await readData(formData) });
  revalidate();
  redirect("/admin/homes");
}

export async function deleteHome(formData: FormData) {
  await prisma.readyHome.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

export async function toggleHome(formData: FormData) {
  const id = str(formData, "id");
  const current = await prisma.readyHome.findUnique({ where: { id } });
  if (current) {
    await prisma.readyHome.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidate();
  }
}

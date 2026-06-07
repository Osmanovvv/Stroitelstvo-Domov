"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num, bool } from "@/app/lib/form";
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
    sortOrder: num(formData, "sortOrder"),
    isVisible: bool(formData, "isVisible"),
  };
}

export async function createProject(formData: FormData) {
  await prisma.project.create({ data: await readData(formData) });
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

"use server";

import type { Project } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage, readExtraImage } from "@/app/lib/upload";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, extraImageFields, toRecord } from "./config";

async function readData(formData: FormData) {
  const image = await saveUploadedImage(file(formData, "imageFile"), str(formData, "imageExisting"));
  // readExtraImage — учитывает галочку «Удалить это фото» в админке.
  const image2 = await readExtraImage(formData, "image2");
  const image3 = await readExtraImage(formData, "image3");
  const plan = await readExtraImage(formData, "plan");
  return {
    name: str(formData, "name"),
    area: str(formData, "area"),
    floors: str(formData, "floors"),
    price: str(formData, "price"),
    time: str(formData, "time"),
    tag: str(formData, "tag"),
    description: str(formData, "description"),
    image,
    // Пустая строка = картинка не задана (поля nullable в схеме) — фильтруется на сайте.
    image2: image2 || null,
    image3: image3 || null,
    plan: plan || null,
  };
}

const actions = createResourceActions<Project, ReturnType<typeof toRecord>>({
  model: prisma.project as unknown as CollectionDelegate<Project>,
  hasImage,
  extraImageFields: extraImageFields.map((f) => f.name),
  readData,
  toRecord,
});

export async function createProject(formData: FormData) {
  return actions.create(formData);
}
export async function updateProject(formData: FormData) {
  return actions.update(formData);
}
export async function deleteProject(id: string) {
  return actions.remove(id);
}
export async function toggleProject(id: string) {
  return actions.toggle(id);
}
export async function moveProject(id: string, direction: "up" | "down") {
  return actions.move(id, direction);
}

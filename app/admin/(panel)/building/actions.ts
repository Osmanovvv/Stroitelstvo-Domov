"use server";

import type { BuildingHome } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, extraImageFields, toRecord } from "./config";

async function readData(formData: FormData) {
  const image = await saveUploadedImage(file(formData, "imageFile"), str(formData, "imageExisting"));
  const image2 = await saveUploadedImage(file(formData, "image2File"), str(formData, "image2Existing"));
  const image3 = await saveUploadedImage(file(formData, "image3File"), str(formData, "image3Existing"));
  const image4 = await saveUploadedImage(file(formData, "image4File"), str(formData, "image4Existing"));
  return {
    title: str(formData, "title"),
    stage: str(formData, "stage"),
    finish: str(formData, "finish"),
    location: str(formData, "location"),
    image,
    // Пустая строка = фото не задано (поля nullable в схеме) — фильтруется на сайте.
    image2: image2 || null,
    image3: image3 || null,
    image4: image4 || null,
  };
}

const actions = createResourceActions<BuildingHome, ReturnType<typeof toRecord>>({
  model: prisma.buildingHome as unknown as CollectionDelegate<BuildingHome>,
  hasImage,
  extraImageFields: extraImageFields.map((f) => f.name),
  readData,
  toRecord,
});

export async function createBuilding(formData: FormData) {
  return actions.create(formData);
}
export async function updateBuilding(formData: FormData) {
  return actions.update(formData);
}
export async function deleteBuilding(id: string) {
  return actions.remove(id);
}
export async function toggleBuilding(id: string) {
  return actions.toggle(id);
}
export async function moveBuilding(id: string, direction: "up" | "down") {
  return actions.move(id, direction);
}

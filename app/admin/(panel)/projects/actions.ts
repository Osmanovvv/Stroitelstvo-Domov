"use server";

import type { Project } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, toRecord } from "./config";

async function readData(formData: FormData) {
  const image = await saveUploadedImage(file(formData, "imageFile"), str(formData, "imageExisting"));
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

const actions = createResourceActions<Project, ReturnType<typeof toRecord>>({
  model: prisma.project as unknown as CollectionDelegate<Project>,
  hasImage,
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

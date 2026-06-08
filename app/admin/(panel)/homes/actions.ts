"use server";

import type { ReadyHome } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, toRecord } from "./config";

async function readData(formData: FormData) {
  const image = await saveUploadedImage(file(formData, "imageFile"), str(formData, "imageExisting"));
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

const actions = createResourceActions<ReadyHome, ReturnType<typeof toRecord>>({
  model: prisma.readyHome as unknown as CollectionDelegate<ReadyHome>,
  hasImage,
  readData,
  toRecord,
});

export async function createHome(formData: FormData) {
  return actions.create(formData);
}
export async function updateHome(formData: FormData) {
  return actions.update(formData);
}
export async function deleteHome(id: string) {
  return actions.remove(id);
}
export async function toggleHome(id: string) {
  return actions.toggle(id);
}
export async function moveHome(id: string, direction: "up" | "down") {
  return actions.move(id, direction);
}

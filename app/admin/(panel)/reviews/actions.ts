"use server";

import type { Review } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, toRecord } from "./config";

async function readData(formData: FormData) {
  const image = await saveUploadedImage(file(formData, "imageFile"), str(formData, "imageExisting"));
  const caption = str(formData, "caption");
  return {
    image,
    // Пустая подпись = null (поле nullable). Скрин говорит сам за себя.
    caption: caption || null,
  };
}

const actions = createResourceActions<Review, ReturnType<typeof toRecord>>({
  model: prisma.review as unknown as CollectionDelegate<Review>,
  hasImage,
  readData,
  toRecord,
});

export async function createReview(formData: FormData) {
  return actions.create(formData);
}
export async function updateReview(formData: FormData) {
  return actions.update(formData);
}
export async function deleteReview(id: string) {
  return actions.remove(id);
}
export async function toggleReview(id: string) {
  return actions.toggle(id);
}
export async function moveReview(id: string, direction: "up" | "down") {
  return actions.move(id, direction);
}

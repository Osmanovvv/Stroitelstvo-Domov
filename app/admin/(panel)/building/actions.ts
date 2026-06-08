"use server";

import type { BuildingHome } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, toRecord } from "./config";

async function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    stage: str(formData, "stage"),
    finish: str(formData, "finish"),
    location: str(formData, "location"),
  };
}

const actions = createResourceActions<BuildingHome, ReturnType<typeof toRecord>>({
  model: prisma.buildingHome as unknown as CollectionDelegate<BuildingHome>,
  hasImage,
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

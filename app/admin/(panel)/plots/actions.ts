"use server";

import type { Plot } from "@prisma/client";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { createResourceActions, type CollectionDelegate } from "@/app/lib/resourceActions";
import { hasImage, toRecord } from "./config";

async function readData(formData: FormData) {
  return {
    title: str(formData, "title"),
    area: str(formData, "area"),
    utilities: str(formData, "utilities"),
    location: str(formData, "location"),
  };
}

const actions = createResourceActions<Plot, ReturnType<typeof toRecord>>({
  model: prisma.plot as unknown as CollectionDelegate<Plot>,
  hasImage,
  readData,
  toRecord,
});

export async function createPlot(formData: FormData) {
  return actions.create(formData);
}
export async function updatePlot(formData: FormData) {
  return actions.update(formData);
}
export async function deletePlot(id: string) {
  return actions.remove(id);
}
export async function togglePlot(id: string) {
  return actions.toggle(id);
}
export async function movePlot(id: string, direction: "up" | "down") {
  return actions.move(id, direction);
}

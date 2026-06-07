"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/prices");
}

export async function createRow(formData: FormData) {
  const count = await prisma.priceRow.count();
  await prisma.priceRow.create({
    data: {
      work: str(formData, "work"),
      warm: str(formData, "warm"),
      pre: str(formData, "pre"),
      full: str(formData, "full"),
      sortOrder: count,
    },
  });
  revalidate();
}

export async function updateRow(formData: FormData) {
  await prisma.priceRow.update({
    where: { id: str(formData, "id") },
    data: {
      work: str(formData, "work"),
      warm: str(formData, "warm"),
      pre: str(formData, "pre"),
      full: str(formData, "full"),
      sortOrder: num(formData, "sortOrder"),
    },
  });
  revalidate();
}

export async function deleteRow(formData: FormData) {
  await prisma.priceRow.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

const PACKAGE_KEYS = [
  "price_warm_label",
  "price_warm_value",
  "price_pre_label",
  "price_pre_value",
  "price_full_label",
  "price_full_value",
];

export async function updatePackages(formData: FormData) {
  for (const key of PACKAGE_KEYS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: str(formData, key) },
      create: { key, value: str(formData, key) },
    });
  }
  revalidate();
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";

const KEYS = [
  "phone",
  "whatsapp_url",
  "telegram_url",
  "max_url",
  "work_start",
  "work_end",
  "seo_title",
  "seo_description",
];

export async function updateSettings(formData: FormData) {
  for (const key of KEYS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: str(formData, key) },
      create: { key, value: str(formData, key) },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

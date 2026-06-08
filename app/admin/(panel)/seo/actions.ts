"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";

const KEYS = ["seo_title", "seo_description"];

export async function updateSeo(formData: FormData) {
  for (const key of KEYS) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: str(formData, key) },
      create: { key, value: str(formData, key) },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/seo");
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";

export async function updateHero(formData: FormData) {
  const image = await saveUploadedImage(
    formData.get("heroImageFile") as File | null,
    str(formData, "heroImageExisting"),
  );

  const values: Record<string, string> = {
    hero_title: str(formData, "hero_title"),
    hero_subtitle: str(formData, "hero_subtitle"),
    hero_image: image,
  };

  for (const [key, value] of Object.entries(values)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/hero");
}

"use server";

import { revalidatePath } from "next/cache";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage } from "@/app/lib/upload";
import { upsertSettings } from "@/app/lib/settings";

export async function updateHero(formData: FormData) {
  const image = await saveUploadedImage(file(formData, "heroImageFile"), str(formData, "heroImageExisting"));

  await upsertSettings({
    hero_title: str(formData, "hero_title"),
    hero_subtitle: str(formData, "hero_subtitle"),
    hero_image: image,
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
}

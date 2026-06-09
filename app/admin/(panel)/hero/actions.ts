"use server";

import { revalidatePath } from "next/cache";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage, deleteUploadedImage } from "@/app/lib/upload";
import { upsertSettings } from "@/app/lib/settings";

export async function updateHero(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  const oldImage = str(formData, "heroImageExisting");
  let image: string;
  try {
    image = await saveUploadedImage(file(formData, "heroImageFile"), oldImage);
  } catch (error) {
    // Ошибки бросать нельзя — в проде их текст скрывается; возвращаем сообщение.
    return { error: error instanceof Error ? error.message : "Не удалось обработать файл" };
  }

  await upsertSettings({
    hero_title: str(formData, "hero_title"),
    hero_subtitle: str(formData, "hero_subtitle"),
    hero_image: image,
  });

  // Старое фото удаляем только после успешной записи и только если оно заменено.
  if (oldImage && oldImage !== image) await deleteUploadedImage(oldImage);

  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { ok: true };
}

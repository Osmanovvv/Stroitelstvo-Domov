"use server";

import { revalidatePath } from "next/cache";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage, deleteUploadedImage } from "@/app/lib/upload";
import { upsertSettings } from "@/app/lib/settings";

// Тексты вводной блока «Подбор и расчёт» + фоновая картинка секции.
// Снятая галочка «убрать фон» / отсутствие файла = оставить как было; галочка
// «убрать фон» = вернуть фирменный градиент (пустой calc_bg_image).
export async function updateCalc(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  const oldImage = str(formData, "calcBgExisting");
  const remove = str(formData, "calcBgRemove") === "on";

  let image = "";
  if (!remove) {
    try {
      image = await saveUploadedImage(file(formData, "calcBgFile"), oldImage);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Не удалось обработать файл" };
    }
  }

  await upsertSettings({
    calc_eyebrow: str(formData, "calc_eyebrow"),
    calc_title: str(formData, "calc_title"),
    calc_subtitle: str(formData, "calc_subtitle"),
    calc_bg_image: image,
  });

  if (oldImage && oldImage !== image) await deleteUploadedImage(oldImage);

  revalidatePath("/");
  revalidatePath("/admin/calc");
  return { ok: true };
}

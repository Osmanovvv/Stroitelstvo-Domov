"use server";

import { revalidatePath } from "next/cache";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage, deleteUploadedImage } from "@/app/lib/upload";
import { upsertSettings } from "@/app/lib/settings";
import { SECTION_FIELDS } from "./config";

// Заголовки всех секций (надзаголовок/заголовок/подпись) + фоны «полос».
// Пустой текст = откат на дефолт (рендерится через `|| sectionIntros`).
// Галочка «убрать фон» = пусто (стандартный цвет); нет файла = оставить как было.
export async function updateSections(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  const values: Record<string, string> = {};

  for (const s of SECTION_FIELDS) {
    values[`${s.id}_eyebrow`] = str(formData, `${s.id}_eyebrow`);
    values[`${s.id}_title`] = str(formData, `${s.id}_title`);
    values[`${s.id}_subtitle`] = str(formData, `${s.id}_subtitle`);
  }

  const bgSections = SECTION_FIELDS.filter((s) => s.bg);
  const oldBg: Record<string, string> = {};
  for (const s of bgSections) {
    const key = `${s.id}_bg_image`;
    const prev = str(formData, `${s.id}_bgExisting`);
    oldBg[key] = prev;
    if (str(formData, `${s.id}_bgRemove`) === "on") {
      values[key] = "";
    } else {
      try {
        values[key] = await saveUploadedImage(file(formData, `${s.id}_bgFile`), prev);
      } catch (error) {
        return { error: error instanceof Error ? error.message : "Не удалось обработать файл" };
      }
    }
  }

  await upsertSettings(values);

  // Старые заменённые/убранные фоны удаляем ПОСЛЕ успешной записи в БД.
  for (const s of bgSections) {
    const key = `${s.id}_bg_image`;
    if (oldBg[key] && oldBg[key] !== values[key]) await deleteUploadedImage(oldBg[key]);
  }

  revalidatePath("/");
  revalidatePath("/admin/sections");
  return { ok: true };
}

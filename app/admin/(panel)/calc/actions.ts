"use server";

import { revalidatePath } from "next/cache";
import { str, file } from "@/app/lib/form";
import { saveUploadedImage, deleteUploadedImage } from "@/app/lib/upload";
import { upsertSettings } from "@/app/lib/settings";

// Поля-картинки Шага 1 квиза (направление). base — общий префикс имён полей формы.
const QUIZ_IMAGE_FIELDS = [
  { key: "quiz_target_ready_image", base: "quizReady" },
  { key: "quiz_target_build_image", base: "quizBuild" },
  { key: "quiz_target_plot_image", base: "quizPlot" },
] as const;

// Фото Шага 1 квиза (первый экран). Снятая галочка «убрать» / отсутствие файла =
// оставить как было; галочка «убрать» = вернуть дефолт (пустое значение → фолбэк).
export async function updateCalc(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  const quizImages: Record<string, string> = {};
  const quizOld: Record<string, string> = {};
  for (const f of QUIZ_IMAGE_FIELDS) {
    const prev = str(formData, `${f.base}Existing`);
    quizOld[f.key] = prev;
    if (str(formData, `${f.base}Remove`) === "on") {
      quizImages[f.key] = "";
    } else {
      try {
        quizImages[f.key] = await saveUploadedImage(file(formData, `${f.base}File`), prev);
      } catch (error) {
        return { error: error instanceof Error ? error.message : "Не удалось обработать файл" };
      }
    }
  }

  await upsertSettings(quizImages);

  for (const f of QUIZ_IMAGE_FIELDS) {
    const prev = quizOld[f.key];
    if (prev && prev !== quizImages[f.key]) await deleteUploadedImage(prev);
  }

  revalidatePath("/");
  revalidatePath("/admin/calc");
  return { ok: true };
}

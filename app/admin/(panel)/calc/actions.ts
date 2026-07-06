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

// Тексты вводной блока «Подбор и расчёт» + фоновая картинка секции + фото квиза.
// Снятая галочка «убрать» / отсутствие файла = оставить как было; галочка «убрать»
// = вернуть дефолт (пустое значение → рендерится фолбэк).
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

  // Обрабатываем 3 фото квиза тем же паттерном (сжатие/сохранение/удаление старого).
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

  await upsertSettings({
    calc_eyebrow: str(formData, "calc_eyebrow"),
    calc_title: str(formData, "calc_title"),
    calc_subtitle: str(formData, "calc_subtitle"),
    calc_bg_image: image,
    ...quizImages,
  });

  if (oldImage && oldImage !== image) await deleteUploadedImage(oldImage);
  for (const f of QUIZ_IMAGE_FIELDS) {
    const prev = quizOld[f.key];
    if (prev && prev !== quizImages[f.key]) await deleteUploadedImage(prev);
  }

  revalidatePath("/");
  revalidatePath("/admin/calc");
  return { ok: true };
}

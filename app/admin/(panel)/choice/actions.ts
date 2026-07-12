"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";
import { requireAdmin } from "@/app/lib/adminAuth";

// Тексты карточек блока выбора (ChoiceSection). Иконки и ссылки на разделы
// фиксированы в коде — здесь редактируется только заголовок и подпись.
export async function updateChoice(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const data: Record<string, string> = {};
  for (let i = 1; i <= 4; i++) {
    data[`choice_${i}_title`] = str(formData, `choice_${i}_title`);
    data[`choice_${i}_text`] = str(formData, `choice_${i}_text`);
  }

  await upsertSettings(data);

  revalidatePath("/");
  revalidatePath("/admin/choice");
  return { ok: true };
}

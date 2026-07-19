"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";
import { requireAdmin } from "@/app/lib/adminAuth";

// Тексты 4 карточек блока «Ипотека» (PaymentSection). Заголовок/подзаголовок блока
// и фон правятся в «Заголовки секций»; кнопка и логотипы банков фиксированы в коде.
export async function updateMortgage(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const data: Record<string, string> = {};
  for (let i = 1; i <= 4; i++) {
    data[`payment_f${i}_title`] = str(formData, `payment_f${i}_title`);
    data[`payment_f${i}_text`] = str(formData, `payment_f${i}_text`);
  }

  await upsertSettings(data);

  revalidatePath("/");
  revalidatePath("/admin/mortgage");
  return { ok: true };
}

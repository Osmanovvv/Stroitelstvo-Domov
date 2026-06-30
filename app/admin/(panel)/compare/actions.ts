"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

// Тексты блока «Дом или квартира» (CompareSection). Списки пунктов хранятся
// строкой — по одному пункту на строку.
export async function updateCompare(
  formData: FormData,
): Promise<{ ok: true } | { error: string }> {
  await upsertSettings({
    compare_eyebrow: str(formData, "compare_eyebrow"),
    compare_title: str(formData, "compare_title"),
    compare_subtitle: str(formData, "compare_subtitle"),
    compare_house_title: str(formData, "compare_house_title"),
    compare_house_features: str(formData, "compare_house_features"),
    compare_house_price: str(formData, "compare_house_price"),
    compare_flat_title: str(formData, "compare_flat_title"),
    compare_flat_features: str(formData, "compare_flat_features"),
    compare_flat_price: str(formData, "compare_flat_price"),
  });

  revalidatePath("/");
  revalidatePath("/admin/compare");
  return { ok: true };
}

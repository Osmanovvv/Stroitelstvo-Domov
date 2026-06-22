"use server";

import { revalidatePath } from "next/cache";
import { packageDefaults } from "@/app/content/landing";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

// Сохраняет три карточки-комплектации: название, подзаголовок и список работ
// (по строке на пункт) для каждого пакета — всё в SiteSetting.
export async function updatePackages(formData: FormData) {
  const keys = packageDefaults.flatMap((p) => [
    `price_${p.key}_label`,
    `price_${p.key}_sub`,
    `price_${p.key}_items`,
  ]);
  await upsertSettings(Object.fromEntries(keys.map((key) => [key, str(formData, key)])));
  revalidatePath("/");
  revalidatePath("/admin/prices");
}

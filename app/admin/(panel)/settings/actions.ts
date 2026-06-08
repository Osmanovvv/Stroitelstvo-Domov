"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

const KEYS = ["phone", "whatsapp_url", "telegram_url", "max_url", "work_start", "work_end"];

export async function updateSettings(formData: FormData) {
  await upsertSettings(Object.fromEntries(KEYS.map((key) => [key, str(formData, key)])));
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

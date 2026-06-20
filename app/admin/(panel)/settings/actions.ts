"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

const KEYS = [
  "phone",
  "whatsapp_url",
  "telegram_url",
  "max_url",
  "work_start",
  "work_end",
  "legal_operator_name",
  "legal_inn",
  "legal_ogrn",
  "legal_address",
  "legal_email",
  "legal_updated",
];

export async function updateSettings(formData: FormData) {
  await upsertSettings(Object.fromEntries(KEYS.map((key) => [key, str(formData, key)])));
  revalidatePath("/");
  // Реквизиты оператора показываются на юридических страницах и в футере.
  revalidatePath("/privacy");
  revalidatePath("/consent");
  revalidatePath("/admin/settings");
}

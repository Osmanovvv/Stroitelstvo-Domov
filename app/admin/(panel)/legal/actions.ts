"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

// Запас ~10x от реального размера документов. Защита от случайной вставки
// гигантского текста: bodySizeLimit экшенов поднят до 25mb ради загрузки фото,
// поэтому лимит длины обязан жить здесь.
const MAX_DOC_LENGTH = 100_000;

async function saveDoc(key: "legal_privacy_body" | "legal_consent_body", formData: FormData) {
  const value = str(formData, key);
  if (value.length > MAX_DOC_LENGTH) {
    throw new Error(
      `Документ слишком длинный: ${value.length} символов при максимуме ${MAX_DOC_LENGTH}.`,
    );
  }
  await upsertSettings({ [key]: value });
  revalidatePath("/privacy");
  revalidatePath("/consent");
  revalidatePath("/admin/legal");
  revalidatePath("/admin/legal/privacy");
  revalidatePath("/admin/legal/consent");
}

export async function updatePrivacyDoc(formData: FormData) {
  await saveDoc("legal_privacy_body", formData);
}

export async function updateConsentDoc(formData: FormData) {
  await saveDoc("legal_consent_body", formData);
}

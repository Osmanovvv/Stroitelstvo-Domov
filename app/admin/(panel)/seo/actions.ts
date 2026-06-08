"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

export async function updateSeo(formData: FormData) {
  await upsertSettings({
    seo_title: str(formData, "seo_title"),
    seo_description: str(formData, "seo_description"),
  });
  revalidatePath("/");
  revalidatePath("/admin/seo");
}

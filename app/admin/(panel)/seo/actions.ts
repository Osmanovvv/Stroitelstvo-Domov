"use server";

import { revalidatePath } from "next/cache";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";
import { requireAdmin } from "@/app/lib/adminAuth";

export async function updateSeo(formData: FormData) {
  await requireAdmin();
  await upsertSettings({
    seo_title: str(formData, "seo_title"),
    seo_description: str(formData, "seo_description"),
    seo_site_name: str(formData, "seo_site_name"),
    site_url: str(formData, "site_url"),
    yandex_verification: str(formData, "yandex_verification"),
    google_verification: str(formData, "google_verification"),
  });
  revalidatePath("/");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/seo");
}

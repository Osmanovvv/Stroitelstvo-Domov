"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";
import { upsertSettings } from "@/app/lib/settings";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/prices");
}

export async function addRow() {
  const max = await prisma.priceRow.aggregate({ _max: { sortOrder: true } });
  await prisma.priceRow.create({
    data: { work: "", warm: "", pre: "", full: "", sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidate();
}

// Сохраняет все строки разом: поля каждой строки заданы с суффиксом её id,
// а список id передаётся скрытыми полями rowId. updateMany не падает, если
// какая-то строка уже удалена в другой вкладке.
export async function saveAllRows(formData: FormData) {
  const ids = formData.getAll("rowId").map((v) => String(v));
  await Promise.all(
    ids.map((id) =>
      prisma.priceRow.updateMany({
        where: { id },
        data: {
          work: str(formData, `work_${id}`),
          warm: str(formData, `warm_${id}`),
          pre: str(formData, `pre_${id}`),
          full: str(formData, `full_${id}`),
        },
      }),
    ),
  );
  revalidate();
}

export async function deleteRow(id: string) {
  await prisma.priceRow.delete({ where: { id } });
  revalidate();
}

const PACKAGE_KEYS = [
  "price_warm_label",
  "price_warm_value",
  "price_pre_label",
  "price_pre_value",
  "price_full_label",
  "price_full_value",
];

export async function updatePackages(formData: FormData) {
  await upsertSettings(Object.fromEntries(PACKAGE_KEYS.map((key) => [key, str(formData, key)])));
  revalidate();
}

import type { Review } from "@prisma/client";
import type { Column, Field, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = true;

export const columns: Column[] = [
  { header: "Скрин", field: "image", kind: "image" },
  { header: "Подпись", field: "caption", kind: "title" },
];

export const fields: Field[] = [
  {
    name: "caption",
    label: "Подпись (необязательно)",
    type: "text",
    placeholder: "Напр.: Ирина, отзыв в WhatsApp",
  },
];

export function toRecord(r: Review): ResourceRecord {
  return {
    id: r.id,
    isVisible: r.isVisible,
    image: r.image,
    values: { caption: r.caption ?? "" },
  };
}

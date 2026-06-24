import type { Plot } from "@prisma/client";
import type { Column, Field, ImageField, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = true;

// Доп. фото участка (помимо основного «Фото» = обложка) — галерея со слайдером.
export const extraImageFields: ImageField[] = [
  { name: "image2", label: "Фото 2" },
  { name: "image3", label: "Фото 3" },
  { name: "image4", label: "Фото 4" },
];

export const columns: Column[] = [
  { header: "Фото", field: "image", kind: "image" },
  { header: "Название", field: "title", kind: "title" },
  { header: "Площадь", field: "area", kind: "text" },
  { header: "Локация", field: "location", kind: "text" },
];

export const fields: Field[] = [
  { name: "title", label: "Название", type: "text", required: true, placeholder: "Участок под дом 104 м²" },
  { name: "area", label: "Площадь", type: "text", placeholder: "5 сот." },
  { name: "utilities", label: "Коммуникации", type: "text", placeholder: "свет, вода рядом" },
  { name: "location", label: "Локация", type: "text", placeholder: "Краснодар +20 км" },
];

export function toRecord(p: Plot): ResourceRecord {
  return {
    id: p.id,
    isVisible: p.isVisible,
    image: p.image,
    extraImages: { image2: p.image2, image3: p.image3, image4: p.image4 },
    values: {
      title: p.title,
      area: p.area,
      utilities: p.utilities,
      location: p.location,
    },
  };
}

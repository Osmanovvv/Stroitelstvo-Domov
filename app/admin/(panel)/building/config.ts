import type { BuildingHome } from "@prisma/client";
import type { Column, Field, ImageField, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = true;

// Доп. фото объекта (помимо основного «Фото» = обложка) — галерея со слайдером.
export const extraImageFields: ImageField[] = [
  { name: "image2", label: "Фото 2" },
  { name: "image3", label: "Фото 3" },
  { name: "image4", label: "Фото 4" },
];

export const columns: Column[] = [
  { header: "Фото", field: "image", kind: "image" },
  { header: "Название", field: "title", kind: "title" },
  { header: "Этап", field: "stage", kind: "text" },
  { header: "Срок", field: "finish", kind: "text" },
];

export const fields: Field[] = [
  { name: "title", label: "Название", type: "text", required: true, placeholder: "Дом 118 м²" },
  { name: "stage", label: "Этап", type: "text", placeholder: "коробка готова" },
  { name: "finish", label: "Срок сдачи", type: "text", placeholder: "сдача в августе" },
  { name: "location", label: "Локация", type: "text", placeholder: "Краснодар +30 км" },
];

export function toRecord(b: BuildingHome): ResourceRecord {
  return {
    id: b.id,
    isVisible: b.isVisible,
    image: b.image,
    extraImages: { image2: b.image2, image3: b.image3, image4: b.image4 },
    values: {
      title: b.title,
      stage: b.stage,
      finish: b.finish,
      location: b.location,
    },
  };
}

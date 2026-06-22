import type { BuiltObject } from "@prisma/client";
import type { Column, Field, ImageField, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = true;

// Доп. фото объекта (помимо основного «Фото») — галерея со слайдером в карточке.
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
  { header: "Год", field: "year", kind: "text" },
];

export const fields: Field[] = [
  { name: "title", label: "Название", type: "text", required: true, placeholder: "Двухэтажный дом 140 м²" },
  { name: "area", label: "Площадь", type: "text", placeholder: "140 м²" },
  { name: "location", label: "Локация", type: "text", placeholder: "Краснодар, Немецкая Деревня" },
  { name: "year", label: "Год сдачи", type: "text", placeholder: "2024" },
];

export function toRecord(o: BuiltObject): ResourceRecord {
  return {
    id: o.id,
    isVisible: o.isVisible,
    image: o.image,
    extraImages: { image2: o.image2, image3: o.image3, image4: o.image4 },
    values: {
      title: o.title,
      area: o.area,
      location: o.location,
      year: o.year,
    },
  };
}

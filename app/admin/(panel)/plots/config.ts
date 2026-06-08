import type { Plot } from "@prisma/client";
import type { Column, Field, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = false;

export const columns: Column[] = [
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
    image: null,
    values: {
      title: p.title,
      area: p.area,
      utilities: p.utilities,
      location: p.location,
    },
  };
}

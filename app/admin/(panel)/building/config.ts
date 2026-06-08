import type { BuildingHome } from "@prisma/client";
import type { Column, Field, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = false;

export const columns: Column[] = [
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
    image: null,
    values: {
      title: b.title,
      stage: b.stage,
      finish: b.finish,
      location: b.location,
    },
  };
}

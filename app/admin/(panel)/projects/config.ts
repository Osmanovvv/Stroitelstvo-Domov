import type { Project } from "@prisma/client";
import type { Column, Field, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = true;

export const columns: Column[] = [
  { header: "Фото", field: "image", kind: "image" },
  { header: "Название", field: "name", kind: "title" },
  { header: "Площадь", field: "area", kind: "text" },
  { header: "Цена", field: "price", kind: "text" },
];

export const fields: Field[] = [
  { name: "name", label: "Название", type: "text", required: true },
  { name: "area", label: "Площадь", type: "text", placeholder: "104 м²" },
  { name: "floors", label: "Этажность", type: "text", placeholder: "1 этаж" },
  { name: "price", label: "Цена", type: "text", placeholder: "от 7,1 млн ₽" },
  { name: "time", label: "Срок", type: "text", placeholder: "5 месяцев" },
  { name: "tag", label: "Тег", type: "text", placeholder: "Готовый семейный формат" },
  { name: "description", label: "Описание", type: "textarea" },
];

export function toRecord(p: Project): ResourceRecord {
  return {
    id: p.id,
    isVisible: p.isVisible,
    image: p.image,
    values: {
      name: p.name,
      area: p.area,
      floors: p.floors,
      price: p.price,
      time: p.time,
      tag: p.tag,
      description: p.description,
    },
  };
}

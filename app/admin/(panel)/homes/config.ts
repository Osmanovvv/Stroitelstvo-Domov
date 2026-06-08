import type { ReadyHome } from "@prisma/client";
import type { Column, Field, ResourceRecord } from "@/app/admin/components/ResourceManager";

export const hasImage = true;

export const columns: Column[] = [
  { header: "Фото", field: "image", kind: "image" },
  { header: "Название", field: "title", kind: "title" },
  { header: "Цена", field: "price", kind: "text" },
  { header: "Статус", field: "status", kind: "text" },
];

export const fields: Field[] = [
  { name: "title", label: "Название", type: "text", required: true },
  { name: "price", label: "Цена", type: "text", placeholder: "от 12,8 млн ₽" },
  { name: "area", label: "Площадь дома", type: "text", placeholder: "126 м²" },
  { name: "land", label: "Площадь участка", type: "text", placeholder: "5,6 сот." },
  { name: "rooms", label: "Комнаты", type: "text", placeholder: "4 комнаты" },
  { name: "baths", label: "Санузлы", type: "text", placeholder: "2 санузла" },
  { name: "location", label: "Локация", type: "text" },
  { name: "status", label: "Статус", type: "text", placeholder: "готов к просмотру" },
];

export function toRecord(h: ReadyHome): ResourceRecord {
  return {
    id: h.id,
    isVisible: h.isVisible,
    image: h.image,
    values: {
      title: h.title,
      price: h.price,
      area: h.area,
      land: h.land,
      rooms: h.rooms,
      baths: h.baths,
      location: h.location,
      status: h.status,
    },
  };
}

import { PrismaClient } from "@prisma/client";
import {
  readyHomes,
  projects,
  buildingHomes,
  plots,
  priceRows,
  faqItems,
  heroDefaults,
} from "../app/content/landing";

const prisma = new PrismaClient();

async function main() {
  await prisma.readyHome.deleteMany();
  await prisma.project.deleteMany();
  await prisma.buildingHome.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.priceRow.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.siteSetting.deleteMany();

  await prisma.readyHome.createMany({
    data: readyHomes.map((h, i) => ({ ...h, sortOrder: i })),
  });
  await prisma.project.createMany({
    data: projects.map((p, i) => ({
      name: p.name,
      area: p.area,
      floors: p.floors,
      price: p.price,
      time: p.time,
      tag: p.tag,
      description: p.description,
      image: p.image,
      sortOrder: i,
    })),
  });
  await prisma.buildingHome.createMany({
    data: buildingHomes.map((b, i) => ({ ...b, sortOrder: i })),
  });
  await prisma.plot.createMany({
    data: plots.map((p, i) => ({ ...p, sortOrder: i })),
  });
  await prisma.priceRow.createMany({
    data: priceRows.map((r, i) => ({ ...r, sortOrder: i })),
  });
  await prisma.faqItem.createMany({
    data: faqItems.map((f, i) => ({ ...f, sortOrder: i })),
  });

  const settings: Record<string, string> = {
    phone: "+79990000000",
    whatsapp_url: "https://wa.me/79990000000",
    telegram_url: "https://t.me/username",
    max_url: "https://max.ru/",
    work_start: "08:00",
    work_end: "19:00",
    seo_title: "Кирпичные дома в Краснодаре | Готовые дома и строительство",
    seo_description:
      "Готовые кирпичные дома, дома в строительстве и строительство под заказ в Краснодаре и радиусе 70 км.",
    price_warm_label: "Теплый контур",
    price_warm_value: "от 48 000 ₽/м²",
    price_pre_label: "Предчистовая",
    price_pre_value: "от 62 000 ₽/м²",
    price_full_label: "Под ключ",
    price_full_value: "от 78 000 ₽/м²",
    hero_title: heroDefaults.title,
    hero_subtitle: heroDefaults.subtitle,
    hero_image: heroDefaults.image,
  };
  await prisma.siteSetting.createMany({
    data: Object.entries(settings).map(([key, value]) => ({ key, value })),
  });

  console.log("Seed complete");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

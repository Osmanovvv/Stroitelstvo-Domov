import { PrismaClient } from "@prisma/client";
import {
  readyHomes,
  projects,
  buildingHomes,
  plots,
  priceRows,
  faqItems,
  builtObjects,
} from "./seed-data";
import { heroDefaults, legalDefaults, packageSettingDefaults } from "../app/content/landing";

const prisma = new PrismaClient();

async function main() {
  // Сид стирает ВСЕ данные (включая правки заказчика через админку и тексты
  // юр. документов). На проде — только с явным подтверждением.
  if (process.env.NODE_ENV === "production" && process.env.FORCE_SEED !== "1") {
    console.error("Отказ: сид перезапишет все данные. На проде запускайте с FORCE_SEED=1.");
    process.exit(1);
  }

  await prisma.readyHome.deleteMany();
  await prisma.project.deleteMany();
  await prisma.buildingHome.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.priceRow.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.builtObject.deleteMany();
  await prisma.siteSetting.deleteMany();

  await prisma.readyHome.createMany({
    // image2-4 — демо-галерея (стенды из фото других домов), чтобы был виден
    // слайдер в карточке. Заказчик заменит реальными фото через админку.
    data: readyHomes.map((h, i) => ({
      ...h,
      image2: readyHomes[(i + 1) % readyHomes.length].image,
      image3: readyHomes[(i + 2) % readyHomes.length].image,
      image4: readyHomes[(i + 3) % readyHomes.length].image,
      sortOrder: i,
    })),
  });
  await prisma.project.createMany({
    // image2/image3/plan — демо-галерея (стенды из фото других проектов),
    // чтобы слайдер в карточке было видно. Заказчик заменит реальными
    // рендерами и планировкой через админку.
    data: projects.map((p, i) => ({
      name: p.name,
      area: p.area,
      floors: p.floors,
      price: p.price,
      time: p.time,
      tag: p.tag,
      description: p.description,
      image: p.image,
      image2: projects[(i + 1) % projects.length].image,
      image3: projects[(i + 2) % projects.length].image,
      plan: projects[(i + 3) % projects.length].image,
      sortOrder: i,
    })),
  });
  await prisma.buildingHome.createMany({
    // image2-4 — демо-галерея (стенды из фото других объектов) для слайдера.
    data: buildingHomes.map((b, i) => ({
      ...b,
      image2: buildingHomes[(i + 1) % buildingHomes.length].image,
      image3: buildingHomes[(i + 2) % buildingHomes.length].image,
      image4: buildingHomes[(i + 3) % buildingHomes.length].image,
      sortOrder: i,
    })),
  });
  await prisma.plot.createMany({
    // image2-4 — демо-галерея (стенды из фото других участков) для слайдера.
    data: plots.map((p, i) => ({
      ...p,
      image2: plots[(i + 1) % plots.length].image,
      image3: plots[(i + 2) % plots.length].image,
      image4: plots[(i + 3) % plots.length].image,
      sortOrder: i,
    })),
  });
  await prisma.priceRow.createMany({
    data: priceRows.map((r, i) => ({ ...r, sortOrder: i })),
  });
  await prisma.faqItem.createMany({
    data: faqItems.map((f, i) => ({ ...f, sortOrder: i })),
  });
  await prisma.builtObject.createMany({
    // image2-4 — демо-галерея (стенды из фото других объектов), чтобы был виден
    // слайдер. Заказчик заменит реальными фото объекта через админку.
    data: builtObjects.map((b, i) => ({
      ...b,
      image2: builtObjects[(i + 1) % builtObjects.length].image,
      image3: builtObjects[(i + 2) % builtObjects.length].image,
      image4: builtObjects[(i + 3) % builtObjects.length].image,
      sortOrder: i,
    })),
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
    price_warm_value: "от 48 000 ₽/м²",
    price_pre_value: "от 62 000 ₽/м²",
    price_full_value: "от 78 000 ₽/м²",
    ...packageSettingDefaults(),
    hero_title: heroDefaults.title,
    hero_subtitle: heroDefaults.subtitle,
    hero_image: heroDefaults.image,
    ...legalDefaults,
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

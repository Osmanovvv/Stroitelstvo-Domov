// Одноразовый скрипт: выставляет hero_* в БД на новые дефолты (старый дизайн hero).
// Запуск: npx tsx scripts/set-hero-defaults.ts  — после можно удалить.
import { PrismaClient } from "@prisma/client";
import { heroDefaults } from "../app/content/landing";

const prisma = new PrismaClient();

async function main() {
  const entries: Record<string, string> = {
    hero_title: heroDefaults.title,
    hero_subtitle: heroDefaults.subtitle,
    hero_image: heroDefaults.image,
  };
  for (const [key, value] of Object.entries(entries)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`set ${key} = ${value}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

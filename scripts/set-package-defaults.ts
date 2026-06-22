// Одноразовый скрипт: выставляет настройки комплектаций (label/sub/items для
// warm/pre/full) на дефолты из content/landing. Запуск:
//   npx tsx scripts/set-package-defaults.ts
import { PrismaClient } from "@prisma/client";
import { packageSettingDefaults } from "../app/content/landing";

const prisma = new PrismaClient();

async function main() {
  for (const [key, value] of Object.entries(packageSettingDefaults())) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`set ${key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

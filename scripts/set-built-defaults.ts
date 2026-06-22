// Одноразовый скрипт: наполняет таблицу BuiltObject дефолтными объектами, если
// она пуста (после миграции таблица создаётся пустой). Запуск:
//   npx tsx scripts/set-built-defaults.ts
import { PrismaClient } from "@prisma/client";
import { builtObjects } from "../prisma/seed-data";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.builtObject.count();
  if (count > 0) {
    console.log(`BuiltObject уже наполнена (${count}) — пропускаю.`);
    return;
  }
  await prisma.builtObject.createMany({
    data: builtObjects.map((b, i) => ({ ...b, sortOrder: i })),
  });
  console.log(`Добавлено объектов: ${builtObjects.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Демо-наполнение галереи построенных объектов (image2/image3/image4) на текущей
// БД, чтобы был виден слайдер в карточке. Стенды берёт из фото других объектов.
// Безопасность: не копирует загруженные через админку файлы (/uploads/...), иначе
// один файл оказался бы общим для двух записей и удаление одной осиротило бы фото
// другой. Запуск: npx tsx scripts/set-built-gallery.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const objects = await prisma.builtObject.findMany({ orderBy: { sortOrder: "asc" } });
  const n = objects.length;
  if (n === 0) {
    console.log("Объектов нет — пропускаю.");
    return;
  }
  const stand = (src: string | null) =>
    src && !src.startsWith("/uploads/") ? src : null;

  for (let i = 0; i < n; i++) {
    await prisma.builtObject.update({
      where: { id: objects[i].id },
      data: {
        image2: stand(objects[(i + 1) % n].image),
        image3: stand(objects[(i + 2) % n].image),
        image4: stand(objects[(i + 3) % n].image),
      },
    });
  }
  console.log(`Галерея-заглушки проставлены для объектов: ${n}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

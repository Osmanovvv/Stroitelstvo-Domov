// Демо-наполнение галереи проектов (image2/image3/plan) на текущей БД, чтобы
// был виден слайдер в карточке. Берёт стенды из фото других проектов — заказчик
// заменит реальными рендерами и планировкой через админку.
// Запуск: npx tsx scripts/set-project-gallery.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  const n = projects.length;
  if (n === 0) {
    console.log("Проектов нет — пропускаю.");
    return;
  }
  // Безопасность: НЕ копируем загруженные через админку файлы (/uploads/...),
  // иначе один файл оказался бы общим для двух записей, и удаление/замена одной
  // осиротит фото другой. Стенды берём только из статичных дефолтов (/projects).
  const stand = (src: string | null) =>
    src && !src.startsWith("/uploads/") ? src : null;

  for (let i = 0; i < n; i++) {
    await prisma.project.update({
      where: { id: projects[i].id },
      data: {
        image2: stand(projects[(i + 1) % n].image),
        image3: stand(projects[(i + 2) % n].image),
        plan: stand(projects[(i + 3) % n].image),
      },
    });
  }
  console.log(`Галерея-заглушки проставлены для проектов: ${n}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

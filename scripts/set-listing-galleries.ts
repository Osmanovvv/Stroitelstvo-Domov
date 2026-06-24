// Демо-галереи (несколько фото для слайдера) на ТЕКУЩЕЙ БД — для готовых домов,
// домов в строительстве и участков. Нужно, чтобы заказчик сразу увидел слайдер
// без полного пересоздания БД (db:seed стёр бы правки админки).
//
// Безопасность: НЕ трогаем фото, загруженные через админку (/uploads/...) —
// и как источник стендов, и как уже выставленную обложку. Идемпотентно.
// Запуск: npx tsx scripts/set-listing-galleries.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Статичный пул фото для домов/участков, у которых фото ещё не было вовсе.
const STATIC_POOL = [
  "/projects/project-klever-80.jpg",
  "/projects/project-yuzhny-104.jpg",
  "/projects/project-semeyny-126.jpg",
  "/projects/project-vidny-140.jpg",
  "/projects/project-praktichny-92.jpg",
  "/projects/project-komfort-118.jpg",
  "/projects/project-prostor-136.jpg",
];

const isUpload = (src: string | null | undefined) => !!src && src.startsWith("/uploads/");
// Стенд берём только из статичных фото — НЕ из /uploads, иначе один файл оказался
// бы общим для двух записей и удаление одной осиротило бы фото другой.
const stand = (src: string | null | undefined) => (src && !isUpload(src) ? src : null);

async function main() {
  // Готовые дома: основное фото уже есть — добавляем стенды из фото других домов.
  const homes = await prisma.readyHome.findMany({ orderBy: { sortOrder: "asc" } });
  const hn = homes.length;
  for (let i = 0; i < hn; i++) {
    await prisma.readyHome.update({
      where: { id: homes[i].id },
      data: {
        image2: stand(homes[(i + 1) % hn].image),
        image3: stand(homes[(i + 2) % hn].image),
        image4: stand(homes[(i + 3) % hn].image),
      },
    });
  }
  console.log(`Галерея-заглушки: готовые дома ${hn}`);

  // Дома в строительстве: фото не было — ставим обложку + галерею из статичного
  // пула. Записи с уже загруженной через админку обложкой (/uploads) пропускаем.
  const buildings = await prisma.buildingHome.findMany({ orderBy: { sortOrder: "asc" } });
  let bTouched = 0;
  for (let i = 0; i < buildings.length; i++) {
    if (isUpload(buildings[i].image)) continue;
    const base = i % STATIC_POOL.length;
    await prisma.buildingHome.update({
      where: { id: buildings[i].id },
      data: {
        image: STATIC_POOL[base],
        image2: STATIC_POOL[(base + 1) % STATIC_POOL.length],
        image3: STATIC_POOL[(base + 2) % STATIC_POOL.length],
        image4: STATIC_POOL[(base + 3) % STATIC_POOL.length],
      },
    });
    bTouched++;
  }
  console.log(`Галерея-заглушки: дома в строительстве ${bTouched}/${buildings.length}`);

  // Участки: то же самое.
  const plots = await prisma.plot.findMany({ orderBy: { sortOrder: "asc" } });
  let pTouched = 0;
  for (let i = 0; i < plots.length; i++) {
    if (isUpload(plots[i].image)) continue;
    const base = (i + 2) % STATIC_POOL.length; // сдвиг, чтобы фото отличались от стройки
    await prisma.plot.update({
      where: { id: plots[i].id },
      data: {
        image: STATIC_POOL[base],
        image2: STATIC_POOL[(base + 1) % STATIC_POOL.length],
        image3: STATIC_POOL[(base + 2) % STATIC_POOL.length],
        image4: STATIC_POOL[(base + 3) % STATIC_POOL.length],
      },
    });
    pTouched++;
  }
  console.log(`Галерея-заглушки: участки ${pTouched}/${plots.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

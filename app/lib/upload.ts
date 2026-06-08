import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 15 * 1024 * 1024; // 15 МБ на исходник (на выходе будет в разы меньше)

// Самая длинная сторона ужимается до этого размера — больше для веба не нужно,
// next/image потом отдаёт картинку под конкретное устройство.
const MAX_DIMENSION = 2400;
// Качество WebP: визуально без потерь для фото, но заметно легче исходника.
const WEBP_QUALITY = 82;

// Разрешённые входные форматы (по MIME, а не по имени файла) — небезопасные
// svg/html/js исключены. На выход всё конвертируется в оптимизированный WebP.
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

// Удаляет ранее загруженный файл. Трогает ТОЛЬКО файлы из /uploads
// (не /hero-дефолты, не внешние URL); basename защищает от обхода путей.
export async function deleteUploadedImage(imagePath: string | null | undefined): Promise<void> {
  if (!imagePath || !imagePath.startsWith("/uploads/")) {
    return;
  }
  try {
    await unlink(path.join(UPLOAD_DIR, path.basename(imagePath)));
  } catch {
    // файла уже нет — это нормально
  }
}

export async function saveUploadedImage(
  file: File | null,
  existingPath: string,
): Promise<string> {
  if (!file || file.size === 0) {
    return existingPath;
  }

  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Недопустимый тип файла. Разрешены JPG, PNG, WebP, GIF, AVIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Файл слишком большой (максимум 15 МБ).");
  }

  const input = Buffer.from(await file.arrayBuffer());

  // Сжимаем и оптимизируем прямо при загрузке: поворот по EXIF, ресайз до
  // разумного максимума без растягивания, конвертация в WebP. Метаданные
  // (EXIF/GPS) при этом отбрасываются автоматически.
  let output: Buffer;
  try {
    const animated = file.type === "image/gif";
    let pipeline = sharp(input, animated ? { animated: true } : {});
    if (!animated) {
      pipeline = pipeline.rotate();
    }
    output = await pipeline
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    throw new Error("Не удалось обработать изображение. Попробуйте другой файл.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  await writeFile(path.join(UPLOAD_DIR, fileName), output);

  // Старый файл НЕ удаляем здесь: его удаляет экшен уже ПОСЛЕ успешной записи
  // в БД (точка невозврата), иначе при ошибке БД фото пропадёт безвозвратно.
  return `/uploads/${fileName}`;
}

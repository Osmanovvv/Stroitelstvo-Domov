import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 8 * 1024 * 1024; // 8 МБ

// Расширение определяется по MIME-типу, а не по имени файла, поэтому
// небезопасные форматы (svg, html, js) и подмена имени исключены.
const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export async function saveUploadedImage(
  file: File | null,
  existingPath: string,
): Promise<string> {
  if (!file || file.size === 0) {
    return existingPath;
  }

  const ext = MIME_EXT[file.type];
  if (!ext) {
    throw new Error("Недопустимый тип файла. Разрешены JPG, PNG, WebP, GIF, AVIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Файл слишком большой (максимум 8 МБ).");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);

  return `/uploads/${fileName}`;
}

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Сохранение файла заявки (проект/планировка) «как есть» — это НЕ картинка для
// веба, поэтому не жмём в WebP (в отличие от upload.ts). Валидация по расширению
// + размеру; опасные типы (exe/js/html/svg) в список не входят.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 20 * 1024 * 1024; // 20 МБ

const ALLOWED_EXT = new Set([
  "pdf", "jpg", "jpeg", "png", "webp", "heic",
  "doc", "docx", "xls", "xlsx", "dwg", "zip", "rar",
]);

export type SavedLeadFile = { url: string; name: string; buffer: Buffer };

export async function saveLeadFile(file: File | null): Promise<SavedLeadFile | null> {
  if (!file || file.size === 0) return null;

  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Недопустимый тип файла. Разрешены PDF, JPG, PNG, DOC, XLS, DWG, ZIP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Файл слишком большой (максимум 20 МБ).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Имя на диске: префикс + метка времени + случайное + очищенное исходное имя
  // (с расширением). Небезопасные символы вырезаны — обхода путей нет.
  const safeBase = (file.name.replace(/[^\w.\-]+/g, "_").slice(-60) || `file.${ext}`);
  const fileName = `lead-${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}`;
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);

  return { url: `/uploads/${fileName}`, name: file.name, buffer };
}

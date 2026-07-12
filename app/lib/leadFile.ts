import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Файлы из заявок (планы домов, личные документы = ПДн) храним ВНЕ public/ —
// их НЕ должен раздавать nginx по прямой ссылке. Отдаём только через
// авторизованный роут /admin/leads/file/<name> (см. leads/file/[name]/route.ts),
// который проверяет сессию и отдаёт файл как attachment (скачивание, не исполнение).
export const LEAD_UPLOAD_DIR = path.join(process.cwd(), "private-uploads");
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
  await mkdir(LEAD_UPLOAD_DIR, { recursive: true });

  // Имя на диске: префикс + метка времени + случайное + очищенное исходное имя.
  const safeBase = (file.name.replace(/[^\w.\-]+/g, "_").slice(-60) || `file.${ext}`);
  const storedName = `lead-${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBase}`;
  await writeFile(path.join(LEAD_UPLOAD_DIR, storedName), buffer);

  // url = путь скачивания через авторизованный роут (не прямой /uploads).
  return { url: `/admin/leads/file/${storedName}`, name: file.name, buffer };
}

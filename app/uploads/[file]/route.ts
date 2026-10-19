import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// Отдача фото из public/uploads, загруженных ПОСЛЕ старта сервера.
// Next.js в проде составляет список файлов public/ один раз при запуске
// (next/dist/server/lib/router-utils/filesystem.js) и про более новые файлы не
// знает: напрямую они дают 404, а оптимизатор /_next/image — 400. Поэтому фото,
// добавленные через админку, были битыми и в админке, и на сайте — до перезапуска
// PM2. Сюда запрос доходит только для таких файлов: известные Next отдаёт сам
// раньше этого роута. Снаружи /uploads/ по-прежнему раздаёт nginx; роут нужен
// прежде всего оптимизатору, который берёт исходную картинку изнутри Next.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  avif: "image/avif",
};

// Только простое имя файла-картинки: без каталогов, без «скрытых» файлов.
const SAFE_NAME = /^[A-Za-z0-9][\w.-]*\.(webp|jpe?g|png|gif|avif)$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = path.basename(file);
  if (name !== file || !SAFE_NAME.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readFile(path.join(UPLOAD_DIR, name));
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = (name.split(".").pop() ?? "").toLowerCase();
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext],
      // Имена файлов уникальны (метка времени при загрузке), содержимое по
      // ссылке не меняется — как у nginx-раздачи /uploads/.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

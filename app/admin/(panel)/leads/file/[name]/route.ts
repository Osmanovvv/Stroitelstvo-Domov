import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/adminAuth";
import { LEAD_UPLOAD_DIR } from "@/app/lib/leadFile";

// Отдача прикреплённого к заявке файла ТОЛЬКО авторизованному админу.
// Файлы лежат в private-uploads (вне public/, nginx их не раздаёт). Роут внутри
// /admin → защищён middleware; плюс requireAdmin как второй слой. Content-Disposition:
// attachment заставляет браузер скачивать файл, а не исполнять (нейтрализует
// потенциально опасный content-type).
const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  dwg: "application/acad",
  zip: "application/zip",
  rar: "application/vnd.rar",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  await requireAdmin();

  const { name } = await params;
  const safe = path.basename(name); // защита от обхода путей (../)

  let data: Buffer;
  try {
    data = await readFile(path.join(LEAD_UPLOAD_DIR, safe));
  } catch {
    return new NextResponse("Файл не найден", { status: 404 });
  }

  const ext = (safe.split(".").pop() ?? "").toLowerCase();
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(safe)}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Сжимает изображение в браузере ДО отправки на сервер: декодирует, ужимает
// до разумного размера и перекодирует в JPEG. Это держит тело запроса
// маленьким (фото с телефона на 20+ МБ → ~300 КБ), поэтому лимиты тела
// запроса/размера файла никогда не задеваются. Если формат не декодируется
// (например, HEIC в неподдерживающем браузере) — возвращаем исходный файл,
// а серверная проверка размера выдаст понятную ошибку.
export async function compressImage(
  file: File,
  maxDimension = 2200,
  quality = 0.85,
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) {
      return file; // если не стало меньше (уже маленькое) — оставляем как есть
    }
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file; // не удалось декодировать — отправим оригинал
  }
}

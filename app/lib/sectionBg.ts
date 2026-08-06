// Фон секции (правка заказчика: «полосам» можно добавить фото-фон). Если картинка
// задана — кладём её под тёмным градиентом-оверлеем, чтобы светлый текст/карточки
// читались. Пусто = undefined → секция остаётся на своём стандартном цвете/градиенте.
// Тот же приём, что и у блока «Подбор и расчёт» (calc_bg_image).

// CSS background-image не проходит через next/image, поэтому картинка отдавалась
// в оригинале (фон «Как мы работаем» весил 213 КБ на телефоне). Прогоняем URL через
// оптимизатор вручную — он умеет отдавать webp нужной ширины по обычной ссылке.
// Ширина обязана быть из images.deviceSizes/imageSizes (next.config.ts), иначе 400.
export function optimizedUrl(src: string, width: number, quality = 60): string {
  // Только локальные файлы (/uploads, /projects, /hero). Внешние ссылки и уже
  // оптимизированные URL отдаём как есть.
  if (!src.startsWith("/") || src.startsWith("/_next/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

const OVERLAY = "linear-gradient(180deg, rgba(10,14,32,0.74), rgba(16,26,48,0.62))";

export function sectionBgStyle(image?: string | null): React.CSSProperties | undefined {
  if (!image) return undefined;
  return {
    // Телефон получает узкую версию (≈40 КБ вместо 213 КБ). Десктоп подменяет
    // картинку на широкую правилом `[style*="--sbg-lg"]` в globals.css — там
    // нужен !important, потому что инлайн-стиль иначе всегда сильнее.
    ["--sbg-lg" as never]: `${OVERLAY}, url("${optimizedUrl(image, 1920)}")`,
    backgroundImage: `${OVERLAY}, url("${optimizedUrl(image, 828)}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

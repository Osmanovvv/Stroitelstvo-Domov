// Фон секции (правка заказчика: «полосам» можно добавить фото-фон). Если картинка
// задана — кладём её под тёмным градиентом-оверлеем, чтобы светлый текст/карточки
// читались. Пусто = undefined → секция остаётся на своём стандартном цвете/градиенте.
// Тот же приём, что и у блока «Подбор и расчёт» (calc_bg_image).
export function sectionBgStyle(image?: string | null): React.CSSProperties | undefined {
  if (!image) return undefined;
  return {
    backgroundImage: `linear-gradient(180deg, rgba(10,14,32,0.74), rgba(16,26,48,0.62)), url("${image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

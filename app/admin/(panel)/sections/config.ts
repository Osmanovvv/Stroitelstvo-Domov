// Список секций для формы «Заголовки и фоны секций». bg=true — «полосы», у которых
// можно задать фон-фото (Ипотека/Как работаем/Доверие/Отзывы/Контакты). У карточных
// секций фон НЕ добавляем (решение заказчика: за карточками фон сливается).
export const SECTION_FIELDS = [
  { id: "projects", label: "Проекты", bg: false },
  { id: "prices", label: "Комплектации и цены", bg: false },
  { id: "homes", label: "Готовые дома", bg: false },
  { id: "building", label: "Дома в строительстве", bg: false },
  { id: "plots", label: "Участки", bg: false },
  { id: "built", label: "Построенные объекты", bg: false },
  { id: "payment", label: "Ипотека и рассрочка", bg: true },
  { id: "process", label: "Как мы работаем", bg: true },
  { id: "trust", label: "Доверие", bg: true },
  { id: "reviews", label: "Отзывы покупателей", bg: true },
  { id: "contacts", label: "Контакты", bg: true },
] as const;

import "./admin.css";

// Минимальный layout для всего /admin: подключает стили админки.
// Оболочка (меню + шапка) живёт в (panel)/layout.tsx и оборачивает только
// авторизованные страницы — на /admin/login сайдбар не показывается.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

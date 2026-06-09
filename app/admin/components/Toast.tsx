"use client";

import { useEffect, useState } from "react";

let counter = 0;

// Показать ненавязчивое уведомление. Можно звать из любого клиентского кода.
export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("admin:toast", { detail: message }));
}

type ToastItem = { id: number; message: string };

// Контейнер тостов: монтируется один раз в layout админки, слушает события
// и показывает всплывающие сообщения, которые сами исчезают через ~2.6с.
export default function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const message = (event as CustomEvent<string>).detail;
      if (!message) return;
      const id = ++counter;
      setItems((prev) => [...prev, { id, message }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    }
    window.addEventListener("admin:toast", onToast as EventListener);
    return () => window.removeEventListener("admin:toast", onToast as EventListener);
  }, []);

  return (
    <div className="admin-toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="admin-toast" role="status">
          <span className="admin-toast-check" aria-hidden="true">
            ✓
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

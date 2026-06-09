"use client";

import type { ReactNode } from "react";
import { toast } from "./Toast";

type ToastFormProps = {
  action: (formData: FormData) => void | Promise<void> | Promise<unknown>;
  message: string;
  className?: string;
  children: ReactNode;
};

// Обёртка над <form action={серверный экшен}>: после успешного выполнения
// показывает тост (Сохранено / Добавлено и т.п.), не мешая работе формы.
export default function ToastForm({ action, message, className, children }: ToastFormProps) {
  async function handle(formData: FormData) {
    await action(formData);
    toast(message);
  }

  return (
    <form className={className} action={handle}>
      {children}
    </form>
  );
}

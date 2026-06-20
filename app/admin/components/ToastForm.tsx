"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "./Toast";

type ToastFormProps = {
  action: (formData: FormData) => void | Promise<void> | Promise<unknown>;
  message: string;
  className?: string;
  children: ReactNode;
};

// Обёртка над <form action={серверный экшен}>: после успешного выполнения
// показывает тост (Сохранено / Добавлено и т.п.), не мешая работе формы.
// Повторный сабмит во время выполнения игнорируется (защита от двойного
// клика), кнопки на это время приглушаются через [data-pending] в CSS.
// При закрытии/перезагрузке вкладки с несохранёнными изменениями браузер
// предупреждает (важно для длинных текстов в «Юр. документах»).
export default function ToastForm({ action, message, className, children }: ToastFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  async function handle(formData: FormData) {
    if (pendingRef.current) {
      return;
    }
    pendingRef.current = true;
    setIsPending(true);
    try {
      await action(formData);
      setIsDirty(false);
      toast(message);
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }

  return (
    <form
      className={className}
      action={handle}
      onInput={() => setIsDirty(true)}
      data-pending={isPending || undefined}
      aria-busy={isPending}
    >
      {children}
    </form>
  );
}

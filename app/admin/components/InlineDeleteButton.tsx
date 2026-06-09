"use client";

import { useState } from "react";
import { toast } from "./Toast";

type InlineDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  confirmText?: string;
  toastMessage?: string;
};

// Кнопка удаления, живущая ВНУТРИ другой формы. type="button" + прямой вызов
// экшена (а не submit), чтобы не отправлять родительскую форму; после успеха —
// тост «Удалено».
export default function InlineDeleteButton({
  action,
  label = "Удалить строку",
  confirmText = "Удалить строку? Действие необратимо.",
  toastMessage = "Удалено",
}: InlineDeleteButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (!confirm(confirmText)) return;
    setPending(true);
    try {
      await action(new FormData());
      toast(toastMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" className="admin-btn danger" disabled={pending} onClick={handleClick}>
      {label}
    </button>
  );
}

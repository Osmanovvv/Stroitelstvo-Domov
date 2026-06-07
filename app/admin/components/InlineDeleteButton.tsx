"use client";

type InlineDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  label?: string;
  confirmText?: string;
};

// Кнопка удаления, живущая ВНУТРИ другой формы: через formAction вызывает
// свой серверный экшен, не мешая основному действию формы.
export default function InlineDeleteButton({
  action,
  label = "Удалить строку",
  confirmText = "Удалить строку? Действие необратимо.",
}: InlineDeleteButtonProps) {
  return (
    <button
      type="submit"
      className="admin-btn danger"
      formAction={action}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}

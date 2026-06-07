"use client";

type DeleteButtonProps = {
  action: (formData: FormData) => void;
  id: string;
  label?: string;
};

export default function DeleteButton({ action, id, label = "Удалить" }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Удалить запись? Действие необратимо.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="admin-btn danger" type="submit">
        {label}
      </button>
    </form>
  );
}

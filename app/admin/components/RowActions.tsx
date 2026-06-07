import Link from "next/link";
import DeleteButton from "./DeleteButton";

type RowActionsProps = {
  editHref: string;
  id: string;
  isVisible?: boolean;
  toggleAction?: (formData: FormData) => void;
  moveAction?: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
};

export default function RowActions({
  editHref,
  id,
  isVisible,
  toggleAction,
  moveAction,
  deleteAction,
}: RowActionsProps) {
  return (
    <div className="admin-row-actions">
      <Link className="admin-btn" href={editHref}>
        Редактировать
      </Link>
      {moveAction && (
        <>
          <form action={moveAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value="up" />
            <button className="admin-btn" type="submit" aria-label="Выше">↑</button>
          </form>
          <form action={moveAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value="down" />
            <button className="admin-btn" type="submit" aria-label="Ниже">↓</button>
          </form>
        </>
      )}
      {toggleAction && (
        <form action={toggleAction}>
          <input type="hidden" name="id" value={id} />
          <button className="admin-btn" type="submit">
            {isVisible ? "Скрыть" : "Показать"}
          </button>
        </form>
      )}
      <DeleteButton action={deleteAction} id={id} />
    </div>
  );
}

import Link from "next/link";
import type { BuildingHome } from "@prisma/client";

type BuildingFormProps = {
  action: (formData: FormData) => void;
  item?: BuildingHome;
};

export default function BuildingForm({ action, item }: BuildingFormProps) {
  return (
    <form className="admin-form" action={action}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="admin-field">
        <label>Название</label>
        <input name="title" defaultValue={item?.title ?? ""} placeholder="Дом 118 м²" required />
      </div>
      <div className="admin-field">
        <label>Этап</label>
        <input name="stage" defaultValue={item?.stage ?? ""} placeholder="коробка готова" />
      </div>
      <div className="admin-field">
        <label>Срок сдачи</label>
        <input name="finish" defaultValue={item?.finish ?? ""} placeholder="сдача в августе" />
      </div>
      <div className="admin-field">
        <label>Локация</label>
        <input name="location" defaultValue={item?.location ?? ""} placeholder="Краснодар +30 км" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn primary" type="submit">Сохранить</button>
        <Link className="admin-btn" href="/admin/building">Отмена</Link>
      </div>
    </form>
  );
}

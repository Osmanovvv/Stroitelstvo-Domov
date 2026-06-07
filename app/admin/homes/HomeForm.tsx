import Image from "next/image";
import type { ReadyHome } from "@prisma/client";

type HomeFormProps = {
  action: (formData: FormData) => void;
  home?: ReadyHome;
};

export default function HomeForm({ action, home }: HomeFormProps) {
  return (
    <form className="admin-form" action={action} encType="multipart/form-data">
      {home && <input type="hidden" name="id" value={home.id} />}
      <input type="hidden" name="imageExisting" value={home?.image ?? ""} />

      <div className="admin-field">
        <label>Название</label>
        <input name="title" defaultValue={home?.title ?? ""} required />
      </div>
      <div className="admin-field">
        <label>Цена</label>
        <input name="price" defaultValue={home?.price ?? ""} placeholder="от 12,8 млн ₽" />
      </div>
      <div className="admin-field">
        <label>Площадь дома</label>
        <input name="area" defaultValue={home?.area ?? ""} placeholder="126 м²" />
      </div>
      <div className="admin-field">
        <label>Площадь участка</label>
        <input name="land" defaultValue={home?.land ?? ""} placeholder="5,6 сот." />
      </div>
      <div className="admin-field">
        <label>Комнаты</label>
        <input name="rooms" defaultValue={home?.rooms ?? ""} placeholder="4 комнаты" />
      </div>
      <div className="admin-field">
        <label>Санузлы</label>
        <input name="baths" defaultValue={home?.baths ?? ""} placeholder="2 санузла" />
      </div>
      <div className="admin-field">
        <label>Локация</label>
        <input name="location" defaultValue={home?.location ?? ""} />
      </div>
      <div className="admin-field">
        <label>Статус</label>
        <input name="status" defaultValue={home?.status ?? ""} placeholder="готов к просмотру" />
      </div>
      <div className="admin-field">
        <label>Фото</label>
        {home?.image && (
          <Image className="admin-preview" src={home.image} alt="" width={160} height={110} />
        )}
        <input name="imageFile" type="file" accept="image/*" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={home?.sortOrder ?? 0} />
      </div>
      <div className="admin-field">
        <label>
          <input name="isVisible" type="checkbox" defaultChecked={home?.isVisible ?? true} /> Показывать на сайте
        </label>
      </div>
      <button className="admin-btn primary" type="submit">Сохранить</button>
    </form>
  );
}

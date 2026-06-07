import type { Plot } from "@prisma/client";

type PlotFormProps = {
  action: (formData: FormData) => void;
  plot?: Plot;
};

export default function PlotForm({ action, plot }: PlotFormProps) {
  return (
    <form className="admin-form" action={action}>
      {plot && <input type="hidden" name="id" value={plot.id} />}
      <div className="admin-field">
        <label>Название</label>
        <input name="title" defaultValue={plot?.title ?? ""} placeholder="Участок под дом 104 м²" required />
      </div>
      <div className="admin-field">
        <label>Площадь</label>
        <input name="area" defaultValue={plot?.area ?? ""} placeholder="5 сот." />
      </div>
      <div className="admin-field">
        <label>Коммуникации</label>
        <input name="utilities" defaultValue={plot?.utilities ?? ""} placeholder="свет, вода рядом" />
      </div>
      <div className="admin-field">
        <label>Локация</label>
        <input name="location" defaultValue={plot?.location ?? ""} placeholder="Краснодар +20 км" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={plot?.sortOrder ?? 0} />
      </div>
      <div className="admin-field">
        <label>
          <input name="isVisible" type="checkbox" defaultChecked={plot?.isVisible ?? true} /> Показывать на сайте
        </label>
      </div>
      <button className="admin-btn primary" type="submit">Сохранить</button>
    </form>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";

type ProjectFormProps = {
  action: (formData: FormData) => void;
  project?: Project;
};

export default function ProjectForm({ action, project }: ProjectFormProps) {
  return (
    <form className="admin-form" action={action}>
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="imageExisting" value={project?.image ?? ""} />

      <div className="admin-field">
        <label>Название</label>
        <input name="name" defaultValue={project?.name ?? ""} required />
      </div>
      <div className="admin-field">
        <label>Площадь</label>
        <input name="area" defaultValue={project?.area ?? ""} placeholder="104 м²" />
      </div>
      <div className="admin-field">
        <label>Этажность</label>
        <input name="floors" defaultValue={project?.floors ?? ""} placeholder="1 этаж" />
      </div>
      <div className="admin-field">
        <label>Цена</label>
        <input name="price" defaultValue={project?.price ?? ""} placeholder="от 7,1 млн ₽" />
      </div>
      <div className="admin-field">
        <label>Срок</label>
        <input name="time" defaultValue={project?.time ?? ""} placeholder="5 месяцев" />
      </div>
      <div className="admin-field">
        <label>Тег</label>
        <input name="tag" defaultValue={project?.tag ?? ""} placeholder="Готовый семейный формат" />
      </div>
      <div className="admin-field">
        <label>Описание</label>
        <textarea name="description" defaultValue={project?.description ?? ""} />
      </div>
      <div className="admin-field">
        <label>Фото</label>
        {project?.image && (
          <Image className="admin-preview" src={project.image} alt="" width={160} height={110} />
        )}
        <input name="imageFile" type="file" accept="image/*" />
      </div>
      <div className="admin-field">
        <label>Порядок</label>
        <input name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} />
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn primary" type="submit">Сохранить</button>
        <Link className="admin-btn" href="/admin/projects">Отмена</Link>
      </div>
    </form>
  );
}

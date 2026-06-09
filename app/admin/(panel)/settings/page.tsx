import { getSettings } from "@/app/lib/queries";
import ToastForm from "@/app/admin/components/ToastForm";
import { updateSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  const s = await getSettings();

  return (
    <>
      <div className="admin-topbar"><h2>Настройки сайта</h2></div>
      <div className="admin-card">
        <ToastForm className="admin-form" action={updateSettings} message="Сохранено">
          <div className="admin-field"><label>Телефон</label><input name="phone" defaultValue={s.phone ?? ""} placeholder="+79990000000" /></div>
          <div className="admin-field"><label>WhatsApp (ссылка)</label><input name="whatsapp_url" defaultValue={s.whatsapp_url ?? ""} /></div>
          <div className="admin-field"><label>Telegram (ссылка)</label><input name="telegram_url" defaultValue={s.telegram_url ?? ""} /></div>
          <div className="admin-field"><label>MAX (ссылка)</label><input name="max_url" defaultValue={s.max_url ?? ""} /></div>
          <div className="admin-field"><label>Начало работы</label><input type="time" name="work_start" defaultValue={s.work_start ?? "08:00"} /></div>
          <div className="admin-field"><label>Конец работы</label><input type="time" name="work_end" defaultValue={s.work_end ?? "19:00"} /></div>
          <button className="admin-btn primary" type="submit">Сохранить настройки</button>
        </ToastForm>
      </div>
    </>
  );
}

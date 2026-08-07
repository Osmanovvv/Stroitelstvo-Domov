import { getSettings } from "@/app/lib/queries";
import ToastForm from "@/app/admin/components/ToastForm";
import { updateSettings } from "./actions";

export const dynamic = "force-dynamic";

// input type="date" принимает только ГГГГ-ММ-ДД; ранние сид-значения хранились
// как ДД.ММ.ГГГГ — конвертируем для defaultValue.
function toDateInputValue(value: string): string {
  const ru = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  return ru ? `${ru[3]}-${ru[2]}-${ru[1]}` : value;
}

export default async function SettingsAdmin() {
  const s = await getSettings();

  return (
    <>
      <div className="admin-topbar"><h2>Настройки сайта</h2></div>
      <div className="admin-card">
        <ToastForm className="admin-form" action={updateSettings} message="Сохранено">
          <div className="admin-field"><label>Телефон</label><input name="phone" defaultValue={s.phone ?? ""} placeholder="+79990000000" /></div>
          <div className="admin-field"><label>WhatsApp (ссылка)</label><input name="whatsapp_url" defaultValue={s.whatsapp_url ?? ""} /></div>
          <div className="admin-field"><label>Telegram (ссылка) — временно скрыт на сайте</label><input name="telegram_url" defaultValue={s.telegram_url ?? ""} /><small className="admin-form-hint">Ссылку можно сохранить, но на сайте она пока не показывается — до подачи уведомления в Роскомнадзор. Вернём по вашей команде.</small></div>
          <div className="admin-field"><label>MAX (ссылка)</label><input name="max_url" defaultValue={s.max_url ?? ""} /></div>
          <div className="admin-field"><label>Начало работы</label><input type="time" name="work_start" defaultValue={s.work_start ?? "08:00"} /></div>
          <div className="admin-field"><label>Конец работы</label><input type="time" name="work_end" defaultValue={s.work_end ?? "19:00"} /></div>
          <h3 className="admin-form-subtitle">Реквизиты оператора персональных данных</h3>
          <p className="admin-form-hint">Показываются в футере сайта, политике обработки персональных данных и согласии на обработку ПДн.</p>
          <div className="admin-field"><label>Наименование (ИП / ООО)</label><input name="legal_operator_name" defaultValue={s.legal_operator_name ?? ""} placeholder="ИП Иванов Иван Иванович" /></div>
          <div className="admin-field"><label>ИНН</label><input name="legal_inn" defaultValue={s.legal_inn ?? ""} /></div>
          <div className="admin-field"><label>ОГРНИП</label><input name="legal_ogrn" defaultValue={s.legal_ogrn ?? ""} /></div>
          <div className="admin-field"><label>Юридический адрес</label><input name="legal_address" defaultValue={s.legal_address ?? ""} placeholder="г. Краснодар, ул. ..." /></div>
          <div className="admin-field"><label>Email для обращений по ПДн</label><input type="email" name="legal_email" defaultValue={s.legal_email ?? ""} placeholder="info@example.ru" /></div>
          <div className="admin-field"><label>Дата редакции политики</label><input type="date" name="legal_updated" defaultValue={toDateInputValue(s.legal_updated ?? "")} /></div>
          <button className="admin-btn primary" type="submit">Сохранить настройки</button>
        </ToastForm>
      </div>
    </>
  );
}

import { prisma } from "@/app/lib/db";
import DeleteButton from "@/app/admin/components/DeleteButton";
import { createFaq, updateFaq, deleteFaq } from "./actions";

export const dynamic = "force-dynamic";

export default async function FaqAdmin() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar"><h2>FAQ</h2></div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Вопросы</h3>
        {items.map((item) => (
          <div key={item.id} style={{ marginBottom: 16, borderBottom: "1px solid #eef1f6", paddingBottom: 16 }}>
            <form className="admin-form" action={updateFaq}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="sortOrder" value={item.sortOrder} />
              <div className="admin-field">
                <label>Вопрос</label>
                <input name="question" defaultValue={item.question} />
              </div>
              <div className="admin-field">
                <label>Ответ</label>
                <textarea name="answer" defaultValue={item.answer} />
              </div>
              <button className="admin-btn primary" type="submit">Сохранить</button>
            </form>
            <div style={{ marginTop: 8 }}>
              <DeleteButton action={deleteFaq} id={item.id} label="Удалить" />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3>Добавить вопрос</h3>
        <form className="admin-form" action={createFaq}>
          <div className="admin-field"><label>Вопрос</label><input name="question" required /></div>
          <div className="admin-field"><label>Ответ</label><textarea name="answer" required /></div>
          <button className="admin-btn primary" type="submit">Добавить</button>
        </form>
      </div>
    </>
  );
}

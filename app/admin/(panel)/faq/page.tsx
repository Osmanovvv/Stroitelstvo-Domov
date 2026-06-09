import { prisma } from "@/app/lib/db";
import InlineDeleteButton from "@/app/admin/components/InlineDeleteButton";
import ToastForm from "@/app/admin/components/ToastForm";
import { addFaq, saveAllFaq, deleteFaq } from "./actions";

export const dynamic = "force-dynamic";

export default async function FaqAdmin() {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <div className="admin-topbar"><h2>FAQ</h2></div>

      <div className="admin-card">
        <div className="admin-topbar" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Вопросы</h3>
          <ToastForm action={addFaq} message="Добавлено">
            <button className="admin-btn primary" type="submit">Добавить вопрос</button>
          </ToastForm>
        </div>

        <ToastForm action={saveAllFaq} message="Сохранено">
          <div className="admin-faq-list">
            {items.map((item, index) => (
              <div className="admin-faq-item" key={item.id}>
                <input type="hidden" name="faqId" value={item.id} />
                <div className="admin-faq-item-head">
                  <span className="admin-item-num">Вопрос {index + 1}</span>
                  <InlineDeleteButton
                    action={deleteFaq.bind(null, item.id)}
                    label="Удалить"
                    confirmText="Удалить вопрос? Действие необратимо."
                  />
                </div>
                <div className="admin-field">
                  <label>Вопрос</label>
                  <input
                    name={`question_${item.id}`}
                    defaultValue={item.question}
                    placeholder="Текст вопроса"
                  />
                </div>
                <div className="admin-field">
                  <label>Ответ</label>
                  <textarea
                    name={`answer_${item.id}`}
                    defaultValue={item.answer}
                    placeholder="Текст ответа"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn primary" type="submit">Сохранить</button>
          </div>
        </ToastForm>
      </div>
    </>
  );
}

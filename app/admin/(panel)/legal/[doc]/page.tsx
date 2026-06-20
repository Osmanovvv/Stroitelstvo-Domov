import Link from "next/link";
import { notFound } from "next/navigation";
import LegalDocEditor from "@/app/admin/components/LegalDocEditor";
import ToastForm from "@/app/admin/components/ToastForm";
import { consentBodyDefault, privacyBodyDefault } from "@/app/content/legal";
import { getSettings } from "@/app/lib/queries";
import { updateConsentDoc, updatePrivacyDoc } from "../actions";

export const dynamic = "force-dynamic";

const DOCS = {
  privacy: {
    title: "Политика обработки персональных данных",
    publicPath: "/privacy",
    field: "legal_privacy_body",
    action: updatePrivacyDoc,
    fallback: privacyBodyDefault,
    message: "Политика сохранена",
  },
  consent: {
    title: "Согласие на обработку персональных данных",
    publicPath: "/consent",
    field: "legal_consent_body",
    action: updateConsentDoc,
    fallback: consentBodyDefault,
    message: "Согласие сохранено",
  },
} as const;

export default async function LegalDocEditorPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const config = DOCS[doc as keyof typeof DOCS];
  if (!config) {
    notFound();
  }

  const s = await getSettings();
  const saved = s[config.field];

  return (
    <>
      <div className="admin-topbar">
        <h2>{config.title}</h2>
        <div className="admin-doc-toolbar">
          <Link className="admin-btn" href="/admin/legal">← К документам</Link>
          <a className="admin-btn" href={config.publicPath} target="_blank" rel="noreferrer">
            Открыть страницу ↗
          </a>
        </div>
      </div>
      <p className="admin-form-hint">
        Редактируйте текст прямо в документе, как в Word: на панели сверху — отмена, стиль строки
        (обычный текст / заголовок / подзаголовок), жирный (Ctrl+B), курсив (Ctrl+I), список и
        ссылки. Фрагменты в фигурных скобках — {"{operator_name}"}, {"{inn}"}, {"{email}"} и
        другие — автоматически заменяются на сайте реквизитами из «Настроек сайта», не удаляйте их
        без необходимости. Чтобы вернуть стандартный текст — удалите всё содержимое (Ctrl+A,
        Delete) и сохраните. После содержательной правки обновите «Дату редакции политики» в
        «Настройках сайта».
      </p>
      <ToastForm className="admin-form admin-form-wide" action={config.action} message={config.message}>
        <LegalDocEditor name={config.field} initialBody={saved?.trim() ? saved : config.fallback} />
        <button className="admin-btn primary" type="submit">Сохранить</button>
      </ToastForm>
    </>
  );
}

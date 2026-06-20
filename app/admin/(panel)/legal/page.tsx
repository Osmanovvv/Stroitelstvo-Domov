import Link from "next/link";
import { getSettings } from "@/app/lib/queries";

export const dynamic = "force-dynamic";

export default async function LegalAdmin() {
  const s = await getSettings();

  const docs = [
    {
      slug: "privacy",
      title: "Политика обработки персональных данных",
      page: "/privacy",
      isCustom: Boolean(s.legal_privacy_body?.trim()),
    },
    {
      slug: "consent",
      title: "Согласие на обработку персональных данных",
      page: "/consent",
      isCustom: Boolean(s.legal_consent_body?.trim()),
    },
  ];

  return (
    <>
      <div className="admin-topbar"><h2>Юридические документы</h2></div>
      <div className="admin-doc-nav">
        {docs.map((doc) => (
          <Link className="admin-doc-button" key={doc.slug} href={`/admin/legal/${doc.slug}`}>
            <strong>{doc.title}</strong>
            <span>
              Страница {doc.page} · {doc.isCustom ? "своя редакция" : "стандартный текст"}
            </span>
            <span className="admin-doc-button-cta">Редактировать →</span>
          </Link>
        ))}
      </div>
    </>
  );
}

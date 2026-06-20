import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import LegalPageShell from "../components/LegalPageShell";
import { buildLegalInfo } from "../content/landing";
import { buildLegalTokens, consentBodyDefault } from "../content/legal";
import { getSettings } from "../lib/queries";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Текст согласия на обработку персональных данных, которое посетитель дает при отправке форм на сайте.",
};

export const revalidate = 3600;

export default async function ConsentPage() {
  const settings = await getSettings();
  const legal = buildLegalInfo(settings);
  // Текст правится в админке («Юр. документы»); пустое значение — стандартный текст.
  const body = settings.legal_consent_body?.trim() ? settings.legal_consent_body : consentBodyDefault;

  return (
    <LegalPageShell title="Согласие на обработку персональных данных" updated={legal.updated}>
      <LegalDocument body={body} tokens={buildLegalTokens(settings, legal)} />
    </LegalPageShell>
  );
}

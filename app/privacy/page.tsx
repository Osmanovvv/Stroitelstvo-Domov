import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import LegalPageShell from "../components/LegalPageShell";
import { buildLegalInfo } from "../content/landing";
import { buildLegalTokens, privacyBodyDefault } from "../content/legal";
import { getSettings } from "../lib/queries";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description:
    "Политика в отношении обработки персональных данных посетителей сайта: цели, состав данных, сроки хранения, права субъектов и порядок отзыва согласия.",
};

export const revalidate = 3600;

export default async function PrivacyPage() {
  const settings = await getSettings();
  const legal = buildLegalInfo(settings);
  // Текст правится в админке («Юр. документы»); пустое значение — стандартный текст.
  const body = settings.legal_privacy_body?.trim() ? settings.legal_privacy_body : privacyBodyDefault;

  return (
    <LegalPageShell title="Политика обработки персональных данных" updated={legal.updated}>
      <LegalDocument body={body} tokens={buildLegalTokens(settings, legal)} />
    </LegalPageShell>
  );
}

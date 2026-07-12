"use server";

import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "./db";
import { rateLimit } from "./rateLimit";
import { str, file } from "./form";
import { saveLeadFile, LEAD_UPLOAD_DIR } from "./leadFile";
import { sendTelegramMessage, sendTelegramDocument, telegramConfigured } from "./telegram";
import { requireAdmin } from "./adminAuth";

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// IP клиента из заголовков, проставленных nginx (x-forwarded-for / x-real-ip).
async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}

type LeadForTelegram = {
  id: string;
  name: string | null;
  phone: string;
  source: string | null;
  message: string | null;
  fileUrl: string | null;
  fileName: string | null;
  notifiedText: boolean;
  notifiedFile: boolean;
  createdAt: Date;
};

function composeText(lead: LeadForTelegram): string {
  const when = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(lead.createdAt);

  return [
    "🏠 <b>Новая заявка с сайта</b>",
    lead.source ? `📌 ${esc(lead.source)}` : "",
    lead.name ? `👤 <b>${esc(lead.name)}</b>` : "",
    `📞 <b>${esc(lead.phone)}</b>`,
    lead.message ? `📝 ${esc(lead.message)}` : "",
    lead.fileName ? `📎 Файл: ${esc(lead.fileName)}` : "",
    `🕒 ${when} МСК`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Доставка в Telegram ИДЕМПОТЕНТНО по частям: сначала текст, затем файл; каждая
// успешно доставленная часть сразу помечается в БД (notifiedText/notifiedFile).
// При повторной отправке (resend) уже доставленная часть не дублируется — уходит
// только недоставленное. Кидает, если нужная часть не прошла после ретраев.
async function deliver(lead: LeadForTelegram, fileBuffer?: Buffer): Promise<void> {
  if (!lead.notifiedText) {
    await sendTelegramMessage(composeText(lead));
    await prisma.lead.update({ where: { id: lead.id }, data: { notifiedText: true } });
    lead.notifiedText = true;
  }
  if (lead.fileUrl && lead.fileName && !lead.notifiedFile) {
    const buf = fileBuffer ?? (await readFile(path.join(LEAD_UPLOAD_DIR, path.basename(lead.fileUrl))));
    await sendTelegramDocument(buf, lead.fileName, `Файл к заявке${lead.name ? ` от ${lead.name}` : ""}`);
    await prisma.lead.update({ where: { id: lead.id }, data: { notifiedFile: true } });
    lead.notifiedFile = true;
  }
}

// Приём заявки с сайта. Порядок ради надёжности: валидация → сохранить файл →
// ЗАПИСАТЬ В БД (точка сохранности, лид больше не потеряется) → доставить в Telegram
// (ошибка НЕ роняет форму, помечаем notifyError и показываем в админке для пересылки).
export async function submitLead(formData: FormData): Promise<{ ok: true } | { error: string }> {
  const name = str(formData, "name");
  const phone = str(formData, "phone");
  const source = str(formData, "source");
  const message = str(formData, "message");
  const consent = str(formData, "consent") === "on";

  // Honeypot: скрытое поле видит только бот. Заполнено → «успех» без сохранения
  // (не сохраняем и не подсказываем боту, что он отсеян).
  if (str(formData, "company_extra")) return { ok: true };

  // Анти-флуд по IP: не больше 5 заявок за 10 минут с одного адреса.
  const ip = await clientIp();
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60_000)) {
    return { error: "Слишком много заявок за короткое время. Попробуйте через несколько минут." };
  }

  if (phone.replace(/\D/g, "").length < 6) return { error: "Укажите телефон." };
  if (!consent) return { error: "Нужно согласие на обработку персональных данных." };

  let saved;
  try {
    saved = await saveLeadFile(file(formData, "projectFile"));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Не удалось обработать файл." };
  }

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
        name: name || null,
        phone,
        source: source || null,
        message: message || null,
        fileUrl: saved?.url ?? null,
        fileName: saved?.name ?? null,
        consent,
        consentAt: new Date(),
      },
    });
  } catch {
    // БД упала — удаляем осиротевший файл (ссылки на него в БД нет).
    if (saved?.url) {
      await unlink(path.join(LEAD_UPLOAD_DIR, path.basename(saved.url))).catch(() => {});
    }
    return { error: "Не удалось сохранить заявку. Попробуйте ещё раз." };
  }

  try {
    if (!telegramConfigured()) throw new Error("Telegram не настроен");
    await deliver(lead, saved?.buffer);
    await prisma.lead.update({ where: { id: lead.id }, data: { notified: true, notifyError: null } });
  } catch (error) {
    await prisma.lead
      .update({
        where: { id: lead.id },
        data: { notifyError: (error instanceof Error ? error.message : String(error)).slice(0, 500) },
      })
      .catch(() => {});
  }

  revalidatePath("/admin/leads");
  return { ok: true };
}

// Повторная отправка из админки (для заявок, не доставленных в Telegram).
export async function resendLead(id: string): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: "Заявка не найдена." };
  try {
    if (!telegramConfigured()) throw new Error("Telegram не настроен");
    await deliver(lead);
    await prisma.lead.update({ where: { id }, data: { notified: true, notifyError: null } });
    revalidatePath("/admin/leads");
    return { ok: true };
  } catch (error) {
    await prisma.lead
      .update({
        where: { id },
        data: { notifyError: (error instanceof Error ? error.message : String(error)).slice(0, 500) },
      })
      .catch(() => {});
    revalidatePath("/admin/leads");
    return { error: error instanceof Error ? error.message : "Не удалось отправить." };
  }
}

export async function setLeadProcessed(id: string, processed: boolean): Promise<void> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { processed } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string): Promise<void> {
  await requireAdmin();
  const lead = await prisma.lead.findUnique({ where: { id } });
  await prisma.lead.delete({ where: { id } });
  if (lead?.fileUrl) {
    await unlink(path.join(LEAD_UPLOAD_DIR, path.basename(lead.fileUrl))).catch(() => {});
  }
  revalidatePath("/admin/leads");
}

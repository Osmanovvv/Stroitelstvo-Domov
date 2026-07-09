"use server";

import { readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { str, file } from "./form";
import { saveLeadFile } from "./leadFile";
import { sendTelegramMessage, sendTelegramDocument, telegramConfigured } from "./telegram";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type LeadForTelegram = {
  name: string | null;
  phone: string;
  source: string | null;
  message: string | null;
  fileUrl: string | null;
  fileName: string | null;
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

// Доставка: текст + (если есть) прикреплённый файл. Кидает при неудаче после ретраев.
async function deliver(lead: LeadForTelegram, buffer?: Buffer): Promise<void> {
  await sendTelegramMessage(composeText(lead));
  if (lead.fileUrl && lead.fileName) {
    const buf = buffer ?? (await readFile(path.join(UPLOAD_DIR, path.basename(lead.fileUrl))));
    await sendTelegramDocument(buf, lead.fileName, `Файл к заявке${lead.name ? ` от ${lead.name}` : ""}`);
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
  await prisma.lead.update({ where: { id }, data: { processed } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string): Promise<void> {
  const lead = await prisma.lead.findUnique({ where: { id } });
  await prisma.lead.delete({ where: { id } });
  if (lead?.fileUrl) {
    await unlink(path.join(UPLOAD_DIR, path.basename(lead.fileUrl))).catch(() => {});
  }
  revalidatePath("/admin/leads");
}

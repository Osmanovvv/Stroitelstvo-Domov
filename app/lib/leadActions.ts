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
import { mailConfigured, sendLeadEmail } from "./mailer";
import { getSettings } from "./queries";
import { requireAdmin } from "./adminAuth";

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// IP клиента из заголовков, проставленных nginx (x-forwarded-for / x-real-ip).
async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}

type LeadForNotify = {
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

function formatWhen(createdAt: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(createdAt);
}

function composeText(lead: LeadForNotify): string {
  return [
    "🏠 <b>Новая заявка с сайта</b>",
    lead.source ? `📌 ${esc(lead.source)}` : "",
    lead.name ? `👤 <b>${esc(lead.name)}</b>` : "",
    `📞 <b>${esc(lead.phone)}</b>`,
    lead.message ? `📝 ${esc(lead.message)}` : "",
    lead.fileName ? `📎 Файл: ${esc(lead.fileName)}` : "",
    `🕒 ${formatWhen(lead.createdAt)} МСК`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Файл к заявке: берём уже прочитанный буфер (при первичной отправке он есть)
// или читаем с диска (при повторной отправке из админки).
async function readLeadFile(lead: LeadForNotify, fileBuffer?: Buffer): Promise<Buffer> {
  return fileBuffer ?? readFile(path.join(LEAD_UPLOAD_DIR, path.basename(lead.fileUrl as string)));
}

// Письмо делаем самодостаточным: заказчик должен понять и перезвонить прямо из
// почты, не заходя в админку. Телефон — ссылкой tel:, чтобы с телефона звонить
// в один тап. Файл идёт вложением.
async function composeEmail(lead: LeadForNotify) {
  const when = formatWhen(lead.createdAt);
  const who = lead.name ? esc(lead.name) : "Без имени";
  const rows: string[] = [];
  if (lead.source) rows.push(`<tr><td style="padding:4px 12px 4px 0;color:#6b7280">Источник</td><td>${esc(lead.source)}</td></tr>`);
  if (lead.name) rows.push(`<tr><td style="padding:4px 12px 4px 0;color:#6b7280">Имя</td><td><b>${esc(lead.name)}</b></td></tr>`);
  rows.push(
    `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">Телефон</td><td><a href="tel:${esc(lead.phone)}" style="font-size:20px;font-weight:700;color:#1a56db;text-decoration:none">${esc(lead.phone)}</a></td></tr>`,
  );
  if (lead.message) rows.push(`<tr><td style="padding:4px 12px 4px 0;color:#6b7280;vertical-align:top">Сообщение</td><td>${esc(lead.message).replace(/\n/g, "<br>")}</td></tr>`);
  if (lead.fileName) rows.push(`<tr><td style="padding:4px 12px 4px 0;color:#6b7280">Файл</td><td>${esc(lead.fileName)} — во вложении</td></tr>`);
  rows.push(`<tr><td style="padding:4px 12px 4px 0;color:#6b7280">Когда</td><td>${when} МСК</td></tr>`);

  // Ссылка на админку — если в настройках указан адрес сайта.
  let adminLink = "";
  try {
    const siteUrl = (await getSettings()).site_url?.trim().replace(/\/+$/, "");
    if (siteUrl && /^https?:\/\//i.test(siteUrl)) {
      adminLink = `<p style="margin:18px 0 0"><a href="${esc(siteUrl)}/admin/leads" style="color:#1a56db">Все заявки в админке</a></p>`;
    }
  } catch {
    // Настройки недоступны — письмо всё равно должно уйти, ссылка не критична.
  }

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;color:#111827;line-height:1.5">
<h2 style="margin:0 0 12px;font-size:18px">Новая заявка с сайта</h2>
<table cellpadding="0" cellspacing="0">${rows.join("")}</table>
${adminLink}
</div>`;

  const text = [
    "Новая заявка с сайта",
    lead.source ? `Источник: ${lead.source}` : "",
    lead.name ? `Имя: ${lead.name}` : "",
    `Телефон: ${lead.phone}`,
    lead.message ? `Сообщение: ${lead.message}` : "",
    lead.fileName ? `Файл: ${lead.fileName} (во вложении)` : "",
    `Когда: ${when} МСК`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: `Заявка с сайта: ${who}, ${lead.phone}`, html, text };
}

async function deliverByEmail(lead: LeadForNotify, fileBuffer?: Buffer): Promise<void> {
  const mail = await composeEmail(lead);
  const attachment =
    lead.fileUrl && lead.fileName
      ? { filename: lead.fileName, content: await readLeadFile(lead, fileBuffer) }
      : undefined;
  await sendLeadEmail({ ...mail, attachment });
}

// Доставка в Telegram ИДЕМПОТЕНТНО по частям: сначала текст, затем файл; каждая
// успешно доставленная часть сразу помечается в БД (notifiedText/notifiedFile).
// При повторной отправке (resend) уже доставленная часть не дублируется — уходит
// только недоставленное. Кидает, если нужная часть не прошла после ретраев.
async function deliverByTelegram(lead: LeadForNotify, fileBuffer?: Buffer): Promise<void> {
  if (!lead.notifiedText) {
    await sendTelegramMessage(composeText(lead));
    await prisma.lead.update({ where: { id: lead.id }, data: { notifiedText: true } });
    lead.notifiedText = true;
  }
  if (lead.fileUrl && lead.fileName && !lead.notifiedFile) {
    const buf = await readLeadFile(lead, fileBuffer);
    await sendTelegramDocument(buf, lead.fileName, `Файл к заявке${lead.name ? ` от ${lead.name}` : ""}`);
    await prisma.lead.update({ where: { id: lead.id }, data: { notifiedFile: true } });
    lead.notifiedFile = true;
  }
}

function errText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Сколько посетитель максимум ждёт доставку уведомления, прежде чем увидит
// «Спасибо». Заявка к этому моменту уже в БД, так что ожидание нужно только для
// того, чтобы в админке сразу стоял верный статус.
const DELIVERY_WAIT_MS = 8000;

// Доставка уведомления по всем НАСТРОЕННЫМ каналам. Сейчас основной — почта,
// Telegram выключен (переменные окружения закомментированы), но код цел: вернут
// токен — начнёт слать снова, оба канала работают параллельно.
// Заявка считается доставленной, если сработал ХОТЯ БЫ ОДИН канал: дублирующее
// уведомление лучше, чем потерянный клиент.
async function deliver(lead: LeadForNotify, fileBuffer?: Buffer): Promise<void> {
  const hasMail = mailConfigured();
  const hasTelegram = telegramConfigured();
  if (!hasMail && !hasTelegram) {
    throw new Error("Уведомления не настроены: нет ни почты (SMTP_*), ни Telegram");
  }

  const problems: string[] = [];
  let delivered = false;

  if (hasMail) {
    try {
      await deliverByEmail(lead, fileBuffer);
      delivered = true;
    } catch (error) {
      problems.push(errText(error));
    }
  }
  if (hasTelegram) {
    try {
      await deliverByTelegram(lead, fileBuffer);
      delivered = true;
    } catch (error) {
      problems.push(`Telegram: ${errText(error)}`);
    }
  }

  if (!delivered) throw new Error(problems.join(" | "));
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

  // Доставку ждём, но не дольше DELIVERY_WAIT_MS. Почта отвечает за доли секунды,
  // и обычно всё успевает до ответа посетителю — в админке заявка сразу «отправлено».
  // А вот если почтовый сервер завис, повторные попытки съедают до полутора минут,
  // и посетитель всё это время смотрит на спиннер уже принятой заявки. Поэтому по
  // истечении лимита отвечаем «Спасибо», а доставка доигрывает в фоне и сама
  // проставит результат: сервер живёт постоянно (pm2), промис не обрывается.
  const delivery = deliver(lead, saved?.buffer).then(
    () => prisma.lead.update({ where: { id: lead.id }, data: { notified: true, notifyError: null } }),
    (error: unknown) =>
      prisma.lead
        .update({ where: { id: lead.id }, data: { notifyError: errText(error).slice(0, 500) } })
        .catch(() => {}),
  );
  await Promise.race([delivery, sleep(DELIVERY_WAIT_MS)]);

  revalidatePath("/admin/leads");
  return { ok: true };
}

// Повторная отправка из админки (кнопка есть только у недоставленных заявок).
export async function resendLead(id: string): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: "Заявка не найдена." };
  try {
    await deliver(lead);
    await prisma.lead.update({ where: { id }, data: { notified: true, notifyError: null } });
    revalidatePath("/admin/leads");
    return { ok: true };
  } catch (error) {
    await prisma.lead
      .update({ where: { id }, data: { notifyError: errText(error).slice(0, 500) } })
      .catch(() => {});
    revalidatePath("/admin/leads");
    return { error: errText(error) || "Не удалось отправить." };
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

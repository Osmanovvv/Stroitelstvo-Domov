// Отправка уведомлений о заявках на почту — замена доставке в Telegram.
//
// Почему почта: Telegram — иностранный сервис, и отправка туда имени с телефоном
// клиента это трансграничная передача персональных данных (ст. 12 152-ФЗ), под
// которую нужно уведомлять Роскомнадзор. Российский почтовый ящик такой проблемы
// не создаёт: данные не покидают страну.
//
// Настраивается переменными окружения, в коде ничего не хранится:
//   SMTP_HOST   — например smtp.mail.ru
//   SMTP_PORT   — 465 (SSL) или 587 (STARTTLS); по умолчанию 465
//   SMTP_USER   — логин ящика, от имени которого шлём
//   SMTP_PASS   — пароль ДЛЯ ВНЕШНИХ ПРИЛОЖЕНИЙ, не основной пароль от почты
//   MAIL_FROM   — адрес отправителя; по умолчанию совпадает с SMTP_USER
//   MAIL_TO     — куда слать уведомления (можно несколько через запятую)
// Пока переменных нет, mailConfigured() возвращает false и код просто не
// вызывается — сайт работает как раньше, заявки сохраняются в БД и админке.

import nodemailer, { type Transporter } from "nodemailer";

const HOST = process.env.SMTP_HOST?.trim();
const PORT = Number(process.env.SMTP_PORT?.trim() || 465);
const USER = process.env.SMTP_USER?.trim();
const PASS = process.env.SMTP_PASS;
const FROM = process.env.MAIL_FROM?.trim() || USER;
const TO = process.env.MAIL_TO?.trim();

export function mailConfigured(): boolean {
  return Boolean(HOST && USER && PASS && TO);
}

// Паузы между попытками, мс — как у Telegram: 5 попыток с нарастающей паузой.
// Почтовые серверы любят отвечать «попробуйте позже» на всплесках.
const RETRY_DELAYS = [400, 1200, 3000, 6000];
const TIMEOUT_MS = 20000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let cached: Transporter | null = null;

function transport(): Transporter {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    // 465 — SSL с первого байта, 587 — обычное соединение с обязательным
    // апгрейдом до TLS. Без requireTLS письмо на 587 могло бы уйти открытым текстом.
    secure: PORT === 465,
    requireTLS: PORT !== 465,
    auth: { user: USER, pass: PASS },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  });
  return cached;
}

export type LeadMail = {
  subject: string;
  html: string;
  text: string;
  /** Файл, приложенный к заявке (проект, планировка). */
  attachment?: { filename: string; content: Buffer };
  /** Ответить клиенту прямо из письма, если он оставил адрес. */
  replyTo?: string;
};

export async function sendLeadEmail(mail: LeadMail): Promise<void> {
  if (!mailConfigured()) {
    throw new Error("Почта не настроена (нет SMTP_HOST/SMTP_USER/SMTP_PASS/MAIL_TO)");
  }

  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt += 1) {
    try {
      await transport().sendMail({
        from: FROM,
        to: TO,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: mail.attachment
          ? [{ filename: mail.attachment.filename, content: mail.attachment.content }]
          : undefined,
      });
      return;
    } catch (err) {
      lastErr = err;
      // Соединение могло протухнуть — пересоздаём транспорт перед повтором.
      cached = null;
      if (attempt < RETRY_DELAYS.length) await sleep(RETRY_DELAYS[attempt]);
    }
  }
  throw new Error(
    `Почта: не удалось отправить после ${RETRY_DELAYS.length + 1} попыток — ${
      lastErr instanceof Error ? lastErr.message : String(lastErr)
    }`,
  );
}

// Разовая проверка связи с почтовым сервером — для кнопки «Проверить почту»
// в админке. Логин/пароль проверяются по-настоящему, письмо при этом не уходит.
export async function verifyMail(): Promise<void> {
  if (!mailConfigured()) {
    throw new Error("Почта не настроена (нет SMTP_HOST/SMTP_USER/SMTP_PASS/MAIL_TO)");
  }
  await transport().verify();
}

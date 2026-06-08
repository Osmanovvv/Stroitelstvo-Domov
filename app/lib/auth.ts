import bcrypt from "bcryptjs";

// Валидный bcrypt-хэш «в никуда»: при неверном логине всё равно выполняем
// bcrypt.compare против него, чтобы время ответа не выдавало, существует ли
// пользователь (защита от тайминг-перебора имён).
const DUMMY_HASH = "$2b$10$RvAQjsyB6d7aQ.Ha07agfunkm.1tq.NRQJjnj531S3pYRD38QL7eK";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH || DUMMY_HASH;
  const passwordOk = await bcrypt.compare(password, hash);
  return (
    username === process.env.ADMIN_USERNAME &&
    Boolean(process.env.ADMIN_PASSWORD_HASH) &&
    passwordOk
  );
}

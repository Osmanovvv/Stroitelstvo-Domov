import bcrypt from "bcryptjs";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  if (username !== process.env.ADMIN_USERNAME) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

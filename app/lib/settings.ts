import { prisma } from "./db";

// Пишет набор настроек одним батчем ($transaction) вместо N последовательных
// upsert. Используется во всех экшенах, сохраняющих настройки сайта.
export async function upsertSettings(values: Record<string, string>): Promise<void> {
  await prisma.$transaction(
    Object.entries(values).map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
    ),
  );
}

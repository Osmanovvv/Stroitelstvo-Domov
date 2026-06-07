import { prisma } from "./db";

export function getReadyHomes() {
  return prisma.readyHome.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getProjects() {
  return prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getBuildingHomes() {
  return prisma.buildingHome.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPlots() {
  return prisma.plot.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export function getPriceRows() {
  return prisma.priceRow.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getFaqItems() {
  return prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

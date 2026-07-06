import { cache } from "react";
import { prisma } from "./db";

// cache() дедуплицирует одинаковые вызовы в пределах одного рендера/запроса:
// напр. getSettings зовут 5 раз на главной — будет один SQL вместо пяти.

export const getReadyHomes = cache(() =>
  prisma.readyHome.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
);

export const getProjects = cache(() =>
  prisma.project.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
);

export const getBuildingHomes = cache(() =>
  prisma.buildingHome.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
);

export const getPlots = cache(() =>
  prisma.plot.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
);

export const getPriceRows = cache(() =>
  prisma.priceRow.findMany({ orderBy: { sortOrder: "asc" } }),
);

export const getFaqItems = cache(() =>
  prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } }),
);

export const getBuiltObjects = cache(() =>
  prisma.builtObject.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
);

export const getReviews = cache(() =>
  prisma.review.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
);

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
});

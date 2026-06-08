import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { str } from "./form";
import { deleteUploadedImage } from "./upload";

// Минимально необходимый «срез» Prisma-делегата: операции опираются только на
// общие поля (id, sortOrder, isVisible, image). Конкретный делегат передаётся
// через каст в actions.ts каждой коллекции.
export type SortableRow = {
  id: string;
  sortOrder: number;
  isVisible: boolean;
  image?: string | null;
};

export type CollectionDelegate<TRaw extends SortableRow> = {
  aggregate(args: { _max: { sortOrder: true } }): Promise<{ _max: { sortOrder: number | null } }>;
  create(args: { data: Record<string, unknown> }): Promise<TRaw>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Prisma.PrismaPromise<TRaw>;
  delete(args: { where: { id: string } }): Promise<unknown>;
  findUnique(args: { where: { id: string } }): Promise<TRaw | null>;
  findFirst(args: {
    where: { sortOrder: { lt: number } | { gt: number } };
    orderBy: { sortOrder: "asc" | "desc" };
  }): Promise<TRaw | null>;
};

export type ResourceActions<TRecord> = {
  create: (formData: FormData) => Promise<TRecord>;
  update: (formData: FormData) => Promise<TRecord>;
  remove: (id: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  move: (id: string, direction: "up" | "down") => Promise<void>;
};

type Config<TRaw extends SortableRow, TRecord> = {
  model: CollectionDelegate<TRaw>;
  hasImage: boolean;
  readData: (formData: FormData) => Promise<Record<string, unknown>>;
  toRecord: (row: TRaw) => TRecord;
};

// Единая фабрика CRUD для сортируемых коллекций (homes/projects/building/plots).
// Убирает копипасту и держит логику (порядок удаления фото, транзакции,
// revalidate) в одном месте.
export function createResourceActions<TRaw extends SortableRow, TRecord>(
  config: Config<TRaw, TRecord>,
): ResourceActions<TRecord> {
  const { model, hasImage, readData, toRecord } = config;

  async function create(formData: FormData): Promise<TRecord> {
    const data = await readData(formData);
    if (hasImage && !data.image) throw new Error("Добавьте фото");
    try {
      const max = await model.aggregate({ _max: { sortOrder: true } });
      const row = await model.create({
        data: { ...data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      });
      revalidatePath("/");
      return toRecord(row);
    } catch (error) {
      // БД упала — убираем только что записанный файл, чтобы не плодить сирот.
      if (hasImage && typeof data.image === "string") await deleteUploadedImage(data.image);
      throw error;
    }
  }

  async function update(formData: FormData): Promise<TRecord> {
    const id = str(formData, "id");
    const data = await readData(formData);
    if (hasImage && !data.image) throw new Error("Добавьте фото");
    const oldImage = hasImage ? str(formData, "imageExisting") : "";
    const newImage = hasImage && typeof data.image === "string" ? data.image : "";
    try {
      const row = await model.update({ where: { id }, data });
      // Запись прошла — теперь безопасно удалить заменённое старое фото.
      if (oldImage && oldImage !== newImage) await deleteUploadedImage(oldImage);
      revalidatePath("/");
      return toRecord(row);
    } catch (error) {
      // БД упала — старое фото цело, убираем новый осиротевший файл.
      if (newImage && newImage !== oldImage) await deleteUploadedImage(newImage);
      throw error;
    }
  }

  async function remove(id: string): Promise<void> {
    const row = hasImage ? await model.findUnique({ where: { id } }) : null;
    await model.delete({ where: { id } });
    if (hasImage) await deleteUploadedImage(row?.image);
    revalidatePath("/");
  }

  async function toggle(id: string): Promise<void> {
    const current = await model.findUnique({ where: { id } });
    if (!current) return;
    await model.update({ where: { id }, data: { isVisible: !current.isVisible } });
    revalidatePath("/");
  }

  async function move(id: string, direction: "up" | "down"): Promise<void> {
    const up = direction === "up";
    const current = await model.findUnique({ where: { id } });
    if (!current) return;
    const neighbor = await model.findFirst({
      where: { sortOrder: up ? { lt: current.sortOrder } : { gt: current.sortOrder } },
      orderBy: { sortOrder: up ? "desc" : "asc" },
    });
    if (!neighbor) return;
    await prisma.$transaction([
      model.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
      model.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
    ]);
    revalidatePath("/");
  }

  return { create, update, remove, toggle, move };
}

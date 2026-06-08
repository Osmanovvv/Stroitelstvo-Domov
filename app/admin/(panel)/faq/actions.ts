"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function addFaq() {
  const max = await prisma.faqItem.aggregate({ _max: { sortOrder: true } });
  await prisma.faqItem.create({
    data: { question: "", answer: "", sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidate();
}

// Сохраняет все вопросы разом: поля каждого заданы с суффиксом id,
// список id передаётся скрытыми полями faqId. updateMany не падает, если
// какой-то вопрос уже удалён в другой вкладке.
export async function saveAllFaq(formData: FormData) {
  const ids = formData.getAll("faqId").map((v) => String(v));
  await Promise.all(
    ids.map((id) =>
      prisma.faqItem.updateMany({
        where: { id },
        data: {
          question: str(formData, `question_${id}`),
          answer: str(formData, `answer_${id}`),
        },
      }),
    ),
  );
  revalidate();
}

export async function deleteFaq(id: string) {
  await prisma.faqItem.delete({ where: { id } });
  revalidate();
}

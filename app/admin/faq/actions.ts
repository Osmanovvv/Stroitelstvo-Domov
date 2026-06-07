"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/db";
import { str, num } from "@/app/lib/form";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function createFaq(formData: FormData) {
  const count = await prisma.faqItem.count();
  await prisma.faqItem.create({
    data: { question: str(formData, "question"), answer: str(formData, "answer"), sortOrder: count },
  });
  revalidate();
}

export async function updateFaq(formData: FormData) {
  await prisma.faqItem.update({
    where: { id: str(formData, "id") },
    data: {
      question: str(formData, "question"),
      answer: str(formData, "answer"),
      sortOrder: num(formData, "sortOrder"),
    },
  });
  revalidate();
}

export async function deleteFaq(formData: FormData) {
  await prisma.faqItem.delete({ where: { id: str(formData, "id") } });
  revalidate();
}

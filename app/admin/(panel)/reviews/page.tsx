import { prisma } from "@/app/lib/db";
import ResourceManager from "@/app/admin/components/ResourceManager";
import { columns, fields, hasImage, toRecord } from "./config";
import { createReview, updateReview, deleteReview, toggleReview, moveReview } from "./actions";

export const dynamic = "force-dynamic";

export default async function ReviewsAdmin() {
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  const items = reviews.map(toRecord);

  return (
    <ResourceManager
      title="Отзывы покупателей"
      addLabel="Добавить отзыв"
      hasImage={hasImage}
      columns={columns}
      fields={fields}
      items={items}
      create={createReview}
      update={updateReview}
      remove={deleteReview}
      toggle={toggleReview}
      move={moveReview}
    />
  );
}

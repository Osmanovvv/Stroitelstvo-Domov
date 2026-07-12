-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "notifiedFile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifiedText" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

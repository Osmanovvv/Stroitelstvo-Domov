-- AlterTable
ALTER TABLE "BuildingHome" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "image2" TEXT,
ADD COLUMN     "image3" TEXT,
ADD COLUMN     "image4" TEXT;

-- AlterTable
ALTER TABLE "Plot" ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "image2" TEXT,
ADD COLUMN     "image3" TEXT,
ADD COLUMN     "image4" TEXT;

-- AlterTable
ALTER TABLE "ReadyHome" ADD COLUMN     "image2" TEXT,
ADD COLUMN     "image3" TEXT,
ADD COLUMN     "image4" TEXT;

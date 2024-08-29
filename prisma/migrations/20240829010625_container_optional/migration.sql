-- DropForeignKey
ALTER TABLE "Inspection" DROP CONSTRAINT "Inspection_containerId_fkey";

-- AlterTable
ALTER TABLE "Inspection" ALTER COLUMN "containerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;

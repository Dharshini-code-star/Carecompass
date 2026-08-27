-- AlterTable
ALTER TABLE "HospitalScheme" ADD COLUMN     "sourceId" TEXT;

-- AddForeignKey
ALTER TABLE "HospitalScheme" ADD CONSTRAINT "HospitalScheme_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

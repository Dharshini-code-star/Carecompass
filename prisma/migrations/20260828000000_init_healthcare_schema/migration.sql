-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('GOVERNMENT', 'HOSPITAL_OFFICIAL', 'INSURER_OFFICIAL', 'TPA_OFFICIAL', 'OPEN_DATA', 'MAP_PROVIDER', 'OTHER_RELIABLE');

-- CreateEnum
CREATE TYPE "Reliability" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'SOURCE_PROVIDED', 'NOT_VERIFIED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "HospitalOwnership" AS ENUM ('GOVERNMENT', 'PRIVATE', 'TRUST_OR_NGO', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "HospitalType" AS ENUM ('MULTI_SPECIALTY', 'SINGLE_SPECIALTY', 'GENERAL', 'MEDICAL_COLLEGE', 'MATERNITY', 'CLINIC_OR_NURSING_HOME', 'DIAGNOSTIC_CENTRE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('VERIFIED_AVAILABLE', 'VERIFIED_UNAVAILABLE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "NetworkStatus" AS ENUM ('VERIFIED_NETWORK', 'VERIFIED_CASHLESS', 'NOT_IN_NETWORK', 'NOT_VERIFIED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EmpanelmentStatus" AS ENUM ('VERIFIED_EMPANELLED', 'NOT_EMPANELLED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ReviewReason" AS ENUM ('MISSING_REQUIRED_FIELD', 'UNVERIFIED_VALUE', 'CONFLICTING_SOURCES', 'POSSIBLE_DUPLICATE', 'STALE_RECORD', 'FAILED_VALIDATION');

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "url" TEXT,
    "apiUrl" TEXT,
    "reliability" "Reliability" NOT NULL DEFAULT 'MEDIUM',
    "authoritativeFor" TEXT,
    "notes" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataEvidence" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "excerpt" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceId" TEXT NOT NULL,

    CONSTRAINT "DataEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "hospitalType" "HospitalType" NOT NULL DEFAULT 'UNKNOWN',
    "ownership" "HospitalOwnership" NOT NULL DEFAULT 'UNKNOWN',
    "address" TEXT,
    "area" TEXT,
    "district" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Chennai',
    "state" TEXT NOT NULL DEFAULT 'Tamil Nadu',
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT,
    "phone" TEXT,
    "emergencyPhone" TEXT,
    "website" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "emergencyDepartment" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "twentyFourSevenEmergency" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "emergencyRelevant" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalFacility" (
    "id" TEXT NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "notes" TEXT,
    "hospitalId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalSpecialization" (
    "id" TEXT NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'UNKNOWN',
    "hospitalId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),

    CONSTRAINT "HospitalSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProvider" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "irdaiRegistrationNo" TEXT,
    "category" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalInsurance" (
    "id" TEXT NOT NULL,
    "networkStatus" "NetworkStatus" NOT NULL DEFAULT 'UNKNOWN',
    "cashlessStatus" "NetworkStatus" NOT NULL DEFAULT 'UNKNOWN',
    "tpa" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "notes" TEXT,
    "hospitalId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentScheme" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "schemeName" TEXT NOT NULL,
    "shortName" TEXT,
    "operator" TEXT,
    "description" TEXT,
    "eligibility" TEXT,
    "incomeCriteria" TEXT,
    "ageCriteria" TEXT,
    "coverage" TEXT,
    "coveredTreatments" TEXT,
    "financialLimit" TEXT,
    "documentsRequired" TEXT,
    "applicationMethod" TEXT,
    "officialWebsite" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HospitalScheme" (
    "id" TEXT NOT NULL,
    "status" "EmpanelmentStatus" NOT NULL DEFAULT 'UNKNOWN',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "hospitalId" TEXT NOT NULL,
    "schemeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HospitalScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodBank" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hospitalName" TEXT,
    "category" TEXT,
    "address" TEXT,
    "area" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Chennai',
    "state" TEXT NOT NULL DEFAULT 'Tamil Nadu',
    "pincode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "bloodComponents" TEXT,
    "operatingHours" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "hospitalId" TEXT,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationTask" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityName" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "currentValue" TEXT,
    "reason" "ReviewReason" NOT NULL,
    "detail" TEXT,
    "sourceKey" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRun" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "datasetKey" TEXT NOT NULL,
    "recordsRead" INTEGER NOT NULL DEFAULT 0,
    "recordsUpserted" INTEGER NOT NULL DEFAULT 0,
    "recordsSkipped" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "report" TEXT,

    CONSTRAINT "ImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataSource_key_key" ON "DataSource"("key");

-- CreateIndex
CREATE INDEX "DataSource_sourceType_idx" ON "DataSource"("sourceType");

-- CreateIndex
CREATE INDEX "DataEvidence_entityType_entityId_idx" ON "DataEvidence"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "DataEvidence_entityType_entityId_field_sourceId_key" ON "DataEvidence"("entityType", "entityId", "field", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_slug_key" ON "Hospital"("slug");

-- CreateIndex
CREATE INDEX "Hospital_city_district_idx" ON "Hospital"("city", "district");

-- CreateIndex
CREATE INDEX "Hospital_ownership_idx" ON "Hospital"("ownership");

-- CreateIndex
CREATE INDEX "Hospital_latitude_longitude_idx" ON "Hospital"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_key_key" ON "Facility"("key");

-- CreateIndex
CREATE INDEX "HospitalFacility_status_idx" ON "HospitalFacility"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalFacility_hospitalId_facilityId_key" ON "HospitalFacility"("hospitalId", "facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_key_key" ON "Specialization"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalSpecialization_hospitalId_specializationId_key" ON "HospitalSpecialization"("hospitalId", "specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceProvider_key_key" ON "InsuranceProvider"("key");

-- CreateIndex
CREATE INDEX "HospitalInsurance_networkStatus_idx" ON "HospitalInsurance"("networkStatus");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalInsurance_hospitalId_providerId_key" ON "HospitalInsurance"("hospitalId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "GovernmentScheme_key_key" ON "GovernmentScheme"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HospitalScheme_hospitalId_schemeId_key" ON "HospitalScheme"("hospitalId", "schemeId");

-- CreateIndex
CREATE UNIQUE INDEX "BloodBank_slug_key" ON "BloodBank"("slug");

-- CreateIndex
CREATE INDEX "BloodBank_city_idx" ON "BloodBank"("city");

-- CreateIndex
CREATE INDEX "VerificationTask_resolved_reason_idx" ON "VerificationTask"("resolved", "reason");

-- AddForeignKey
ALTER TABLE "DataEvidence" ADD CONSTRAINT "DataEvidence_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalFacility" ADD CONSTRAINT "HospitalFacility_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalFacility" ADD CONSTRAINT "HospitalFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalFacility" ADD CONSTRAINT "HospitalFacility_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalInsurance" ADD CONSTRAINT "HospitalInsurance_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalInsurance" ADD CONSTRAINT "HospitalInsurance_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "InsuranceProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalInsurance" ADD CONSTRAINT "HospitalInsurance_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernmentScheme" ADD CONSTRAINT "GovernmentScheme_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalScheme" ADD CONSTRAINT "HospitalScheme_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalScheme" ADD CONSTRAINT "HospitalScheme_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "GovernmentScheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodBank" ADD CONSTRAINT "BloodBank_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodBank" ADD CONSTRAINT "BloodBank_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "DataSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

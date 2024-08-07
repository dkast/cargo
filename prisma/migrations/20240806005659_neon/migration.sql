-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'DUE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OrganizationPlan" AS ENUM ('TRIAL', 'BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "InspectionTripType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('CTPAT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('OPEN', 'CLOSED', 'APPROVED');

-- CreateEnum
CREATE TYPE "InspectionResult" AS ENUM ('PASS', 'FAIL');

-- CreateEnum
CREATE TYPE "InspectionItemResult" AS ENUM ('PASS', 'FAIL', 'NA');

-- CreateEnum
CREATE TYPE "AccessType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "defaultMembershipId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "plan" "OrganizationPlan" NOT NULL DEFAULT 'TRIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subdomain" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "MembershipRole" NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vehicleNbr" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" TEXT NOT NULL,
    "containerNbr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "inspectionNbr" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "operatorId" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "vehicleId" TEXT NOT NULL,
    "licensePlate" TEXT,
    "containerId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isLoaded" BOOLEAN NOT NULL,
    "sealNbr" TEXT,
    "tiresVehicle" TEXT,
    "tiresContainer" TEXT,
    "inspectedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "tripType" "InspectionTripType" NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "inspectionType" "InspectionType" NOT NULL,
    "status" "InspectionStatus" NOT NULL,
    "result" "InspectionResult",
    "notes" TEXT,
    "organizationId" TEXT NOT NULL,
    "locationId" TEXT,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "result" "InspectionItemResult" NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "InspectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionItemFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inspectionItemId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "InspectionItemFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sharePath" TEXT NOT NULL,
    "accessType" "AccessType" NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "password" TEXT,
    "nanoid" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "ShareItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_subdomain_key" ON "Organization"("subdomain");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_organizationId_userId_key" ON "Membership"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Location_organizationId_idx" ON "Location"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_organizationId_name_key" ON "Location"("organizationId", "name");

-- CreateIndex
CREATE INDEX "Company_organizationId_idx" ON "Company"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_organizationId_name_key" ON "Company"("organizationId", "name");

-- CreateIndex
CREATE INDEX "Operator_organizationId_idx" ON "Operator"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_organizationId_name_key" ON "Operator"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_organizationId_licenseNumber_key" ON "Operator"("organizationId", "licenseNumber");

-- CreateIndex
CREATE INDEX "Vehicle_organizationId_idx" ON "Vehicle"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_organizationId_vehicleNbr_key" ON "Vehicle"("organizationId", "vehicleNbr");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_organizationId_licensePlate_key" ON "Vehicle"("organizationId", "licensePlate");

-- CreateIndex
CREATE INDEX "Container_organizationId_idx" ON "Container"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Container_organizationId_containerNbr_key" ON "Container"("organizationId", "containerNbr");

-- CreateIndex
CREATE INDEX "Inspection_inspectionNbr_idx" ON "Inspection"("inspectionNbr");

-- CreateIndex
CREATE INDEX "Inspection_operatorId_idx" ON "Inspection"("operatorId");

-- CreateIndex
CREATE INDEX "Inspection_vehicleId_idx" ON "Inspection"("vehicleId");

-- CreateIndex
CREATE INDEX "Inspection_containerId_idx" ON "Inspection"("containerId");

-- CreateIndex
CREATE INDEX "Inspection_companyId_idx" ON "Inspection"("companyId");

-- CreateIndex
CREATE INDEX "Inspection_organizationId_idx" ON "Inspection"("organizationId");

-- CreateIndex
CREATE INDEX "Inspection_inspectedById_idx" ON "Inspection"("inspectedById");

-- CreateIndex
CREATE INDEX "Inspection_approvedById_idx" ON "Inspection"("approvedById");

-- CreateIndex
CREATE INDEX "Inspection_locationId_idx" ON "Inspection"("locationId");

-- CreateIndex
CREATE INDEX "Inspection_start_idx" ON "Inspection"("start");

-- CreateIndex
CREATE INDEX "Inspection_result_idx" ON "Inspection"("result");

-- CreateIndex
CREATE UNIQUE INDEX "Inspection_organizationId_inspectionNbr_key" ON "Inspection"("organizationId", "inspectionNbr");

-- CreateIndex
CREATE INDEX "InspectionItem_inspectionId_idx" ON "InspectionItem"("inspectionId");

-- CreateIndex
CREATE INDEX "InspectionItem_organizationId_idx" ON "InspectionItem"("organizationId");

-- CreateIndex
CREATE INDEX "InspectionItemFile_inspectionItemId_idx" ON "InspectionItemFile"("inspectionItemId");

-- CreateIndex
CREATE INDEX "InspectionItemFile_organizationId_idx" ON "InspectionItemFile"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ShareItem_nanoid_key" ON "ShareItem"("nanoid");

-- CreateIndex
CREATE INDEX "ShareItem_nanoid_idx" ON "ShareItem"("nanoid");

-- CreateIndex
CREATE INDEX "ShareItem_sharePath_idx" ON "ShareItem"("sharePath");

-- CreateIndex
CREATE INDEX "ShareItem_organizationId_idx" ON "ShareItem"("organizationId");

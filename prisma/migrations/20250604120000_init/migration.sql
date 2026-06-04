-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('new', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "parentContacts" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "motivationLetter" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,
    "about" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'new',
    "rejectionComment" TEXT,
    "invitationSentAt" TIMESTAMP(3),
    "consents" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "Application"("email");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

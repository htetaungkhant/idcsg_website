-- CreateTable
CREATE TABLE "public"."PatientInstructions" (
    "id" TEXT NOT NULL,
    "bannerImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientInstructionCard" (
    "id" TEXT NOT NULL,
    "patientInstructionsId" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "contentTitle" TEXT NOT NULL,
    "contentImage" TEXT,
    "contentDescription" TEXT NOT NULL,
    "downloadableFile" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientInstructionCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PatientInstructionCard" ADD CONSTRAINT "PatientInstructionCard_patientInstructionsId_fkey" FOREIGN KEY ("patientInstructionsId") REFERENCES "public"."PatientInstructions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

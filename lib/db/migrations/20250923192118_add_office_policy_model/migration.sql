-- CreateTable
CREATE TABLE "public"."OfficePolicy" (
    "id" TEXT NOT NULL,
    "hostingDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficePolicy_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `ServiceSection1` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ServiceSection2` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ServiceSection3` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ServiceSection4` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ServiceSection5` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceId]` on the table `ServiceSection1` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `ServiceSection2` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `ServiceSection3` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `ServiceSection4` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `ServiceSection5` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."ServiceSection1" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "public"."ServiceSection2" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "public"."ServiceSection3" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "public"."ServiceSection4" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "public"."ServiceSection5" DROP COLUMN "sortOrder";

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSection1_serviceId_key" ON "public"."ServiceSection1"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSection2_serviceId_key" ON "public"."ServiceSection2"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSection3_serviceId_key" ON "public"."ServiceSection3"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSection4_serviceId_key" ON "public"."ServiceSection4"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSection5_serviceId_key" ON "public"."ServiceSection5"("serviceId");

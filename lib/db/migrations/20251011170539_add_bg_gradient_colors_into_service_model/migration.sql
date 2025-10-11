-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "detailsBgEndingColor" TEXT NOT NULL DEFAULT '#D2F7FF',
ADD COLUMN     "detailsBgStartingColor" TEXT NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "overviewBgEndingColor" TEXT NOT NULL DEFAULT '#642724',
ADD COLUMN     "overviewBgStartingColor" TEXT NOT NULL DEFAULT '#CA4E48';

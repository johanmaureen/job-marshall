/*
  Warnings:

  - You are about to drop the column `remuse` on the `JobSeeker` table. All the data in the column will be lost.
  - Added the required column `resume` to the `JobSeeker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobSeeker" DROP COLUMN "remuse",
ADD COLUMN     "resume" TEXT NOT NULL;

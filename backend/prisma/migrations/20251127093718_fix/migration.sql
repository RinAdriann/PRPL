-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "unlockedLvl" INTEGER,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Educator" ADD COLUMN     "defaultDifficulty" TEXT;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "classroomId" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "difficulty" TEXT;

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "topic" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

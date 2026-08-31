-- CreateTable
CREATE TABLE "LearnStepState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearnStepState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearnStepState_userId_moduleId_idx" ON "LearnStepState"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "LearnStepState_userId_moduleId_stepId_key" ON "LearnStepState"("userId", "moduleId", "stepId");

-- AddForeignKey
ALTER TABLE "LearnStepState" ADD CONSTRAINT "LearnStepState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "LearnModuleProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "currentStepIndex" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "timeSpentMs" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnConceptReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptTag" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "reviewData" JSONB NOT NULL,
    "lastReviewedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "intervalDays" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "timesIncorrect" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnConceptReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnConceptWeight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptTag" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnConceptWeight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearnModuleProgress_userId_idx" ON "LearnModuleProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearnModuleProgress_userId_moduleId_key" ON "LearnModuleProgress"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "LearnConceptReview_userId_nextReviewAt_idx" ON "LearnConceptReview"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "LearnConceptReview_userId_conceptTag_idx" ON "LearnConceptReview"("userId", "conceptTag");

-- CreateIndex
CREATE UNIQUE INDEX "LearnConceptReview_userId_stepId_key" ON "LearnConceptReview"("userId", "stepId");

-- CreateIndex
CREATE UNIQUE INDEX "LearnConceptWeight_userId_conceptTag_key" ON "LearnConceptWeight"("userId", "conceptTag");

-- AddForeignKey
ALTER TABLE "LearnModuleProgress" ADD CONSTRAINT "LearnModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnConceptReview" ADD CONSTRAINT "LearnConceptReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnConceptWeight" ADD CONSTRAINT "LearnConceptWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

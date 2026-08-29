-- CreateTable
CREATE TABLE "LearnHintEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "mistakeKind" TEXT,
    "answerFingerprint" TEXT,
    "hintsShown" INTEGER NOT NULL DEFAULT 0,
    "revealed" BOOLEAN NOT NULL DEFAULT false,
    "eventuallyCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearnHintEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearnHintEvent_stepId_eventType_idx" ON "LearnHintEvent"("stepId", "eventType");

-- CreateIndex
CREATE INDEX "LearnHintEvent_moduleId_stepId_idx" ON "LearnHintEvent"("moduleId", "stepId");

-- CreateIndex
CREATE INDEX "LearnHintEvent_createdAt_idx" ON "LearnHintEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "LearnHintEvent" ADD CONSTRAINT "LearnHintEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

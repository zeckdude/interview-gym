-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "interviewDate" TIMESTAMP(3),
    "dailyHours" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathItemProgress" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "markedUnderstood" BOOLEAN NOT NULL DEFAULT false,
    "passedAt" TIMESTAMP(3),
    "understoodAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathItemProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathStageItem" (
    "id" TEXT NOT NULL,
    "pathType" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "mostAsked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "aiEvaluated" BOOLEAN NOT NULL DEFAULT false,
    "aiReasoning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PathStageItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningPath_userId_idx" ON "LearningPath"("userId");

-- CreateIndex
CREATE INDEX "LearningPath_userId_isActive_idx" ON "LearningPath"("userId", "isActive");

-- CreateIndex
CREATE INDEX "PathItemProgress_pathId_stage_idx" ON "PathItemProgress"("pathId", "stage");

-- CreateIndex
CREATE INDEX "PathItemProgress_userId_pathId_idx" ON "PathItemProgress"("userId", "pathId");

-- CreateIndex
CREATE UNIQUE INDEX "PathItemProgress_pathId_itemId_key" ON "PathItemProgress"("pathId", "itemId");

-- CreateIndex
CREATE INDEX "PathStageItem_pathType_stage_idx" ON "PathStageItem"("pathType", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "PathStageItem_pathType_itemId_key" ON "PathStageItem"("pathType", "itemId");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathItemProgress" ADD CONSTRAINT "PathItemProgress_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

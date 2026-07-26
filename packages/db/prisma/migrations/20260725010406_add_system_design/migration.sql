-- CreateTable
CREATE TABLE "SystemDesignSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "challengeTitle" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "overallScore" DOUBLE PRECISION,
    "sectionScores" JSONB,
    "aiFeedback" TEXT,
    "dialogHistory" JSONB,

    CONSTRAINT "SystemDesignSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemDesignAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "questionText" TEXT NOT NULL DEFAULT '',
    "textContent" TEXT,
    "audioUrl" TEXT,
    "transcript" TEXT,
    "fillerWordCount" INTEGER,
    "wordsPerMinute" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemDesignAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SystemDesignSession_userId_startedAt_idx" ON "SystemDesignSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "SystemDesignAnswer_sessionId_idx" ON "SystemDesignAnswer"("sessionId");

-- AddForeignKey
ALTER TABLE "SystemDesignSession" ADD CONSTRAINT "SystemDesignSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemDesignAnswer" ADD CONSTRAINT "SystemDesignAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SystemDesignSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

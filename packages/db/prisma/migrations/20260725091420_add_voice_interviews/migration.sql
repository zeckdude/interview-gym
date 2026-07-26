-- CreateTable
CREATE TABLE "VoiceInterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "questionIds" JSONB NOT NULL,
    "sessionQuestionCount" INTEGER NOT NULL DEFAULT 1,
    "includeFollowUps" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "overallScore" DOUBLE PRECISION,
    "contentScore" DOUBLE PRECISION,
    "communicationScore" DOUBLE PRECISION,
    "aiFeedback" TEXT,

    CONSTRAINT "VoiceInterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceExchange" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT,
    "order" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "answerTranscript" TEXT,
    "answerAudioUrl" TEXT,
    "answerDurationSec" DOUBLE PRECISION,
    "fillerWordCount" INTEGER,
    "wordsPerMinute" DOUBLE PRECISION,
    "deepgramConfidence" DOUBLE PRECISION,
    "aiContentScore" DOUBLE PRECISION,
    "aiContentFeedback" TEXT,
    "aiGaps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceExchange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoiceInterviewSession_userId_startedAt_idx" ON "VoiceInterviewSession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "VoiceExchange_sessionId_idx" ON "VoiceExchange"("sessionId");

-- AddForeignKey
ALTER TABLE "VoiceInterviewSession" ADD CONSTRAINT "VoiceInterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceExchange" ADD CONSTRAINT "VoiceExchange_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VoiceInterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

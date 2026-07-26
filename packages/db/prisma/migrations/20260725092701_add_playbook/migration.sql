-- AlterTable
ALTER TABLE "VoiceInterviewSession" ADD COLUMN     "companyContextId" TEXT,
ADD COLUMN     "customQuestionTexts" JSONB,
ADD COLUMN     "interviewType" TEXT NOT NULL DEFAULT 'voice',
ADD COLUMN     "mostAskedOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "playbookCategories" JSONB,
ADD COLUMN     "presetId" TEXT;

-- CreateTable
CREATE TABLE "PlaybookProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkedInUrl" TEXT,
    "linkedInText" TEXT,
    "resumeText" TEXT,
    "portfolioUrl" TEXT,
    "githubUrl" TEXT,
    "personalWebsite" TEXT,
    "additionalContext" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSearchCriteria" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetRoles" TEXT[],
    "targetCompanyStage" TEXT[],
    "targetIndustries" TEXT[],
    "preferredStack" TEXT[],
    "locationPreference" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "mustHaves" TEXT[],
    "dealBreakers" TEXT[],
    "additionalNotes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSearchCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isSeeded" BOOLEAN NOT NULL DEFAULT false,
    "questionPrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookSubsection" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "textContent" TEXT,
    "audioUrl" TEXT,
    "transcript" TEXT,
    "fillerWordCount" INTEGER,
    "wordsPerMinute" DOUBLE PRECISION,
    "aiFeedback" TEXT,
    "aiSummary" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookSubsection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "category" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "isSystemDefault" BOOLEAN NOT NULL DEFAULT false,
    "mostAsked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaybookQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulatorCompanyContext" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "companyWebsite" TEXT,
    "jobListingUrl" TEXT,
    "jobListingText" TEXT,
    "additionalNotes" TEXT,
    "researchSummary" TEXT,
    "researchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulatorCompanyContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulatorInterviewer" (
    "id" TEXT NOT NULL,
    "contextId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "linkedInUrl" TEXT,
    "linkedInText" TEXT,
    "researchSummary" TEXT,
    "rapportPoints" TEXT[],
    "researchedAt" TIMESTAMP(3),

    CONSTRAINT "SimulatorInterviewer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookProfile_userId_key" ON "PlaybookProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSearchCriteria_userId_key" ON "JobSearchCriteria"("userId");

-- CreateIndex
CREATE INDEX "PlaybookEntry_userId_category_idx" ON "PlaybookEntry"("userId", "category");

-- CreateIndex
CREATE INDEX "PlaybookSubsection_entryId_idx" ON "PlaybookSubsection"("entryId");

-- CreateIndex
CREATE INDEX "PlaybookQuestion_category_isSystemDefault_idx" ON "PlaybookQuestion"("category", "isSystemDefault");

-- CreateIndex
CREATE INDEX "SimulatorCompanyContext_userId_idx" ON "SimulatorCompanyContext"("userId");

-- CreateIndex
CREATE INDEX "SimulatorInterviewer_contextId_idx" ON "SimulatorInterviewer"("contextId");

-- AddForeignKey
ALTER TABLE "PlaybookProfile" ADD CONSTRAINT "PlaybookProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSearchCriteria" ADD CONSTRAINT "JobSearchCriteria_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookEntry" ADD CONSTRAINT "PlaybookEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookSubsection" ADD CONSTRAINT "PlaybookSubsection_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "PlaybookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookQuestion" ADD CONSTRAINT "PlaybookQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatorCompanyContext" ADD CONSTRAINT "SimulatorCompanyContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatorInterviewer" ADD CONSTRAINT "SimulatorInterviewer_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "SimulatorCompanyContext"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceInterviewSession" ADD CONSTRAINT "VoiceInterviewSession_companyContextId_fkey" FOREIGN KEY ("companyContextId") REFERENCES "SimulatorCompanyContext"("id") ON DELETE SET NULL ON UPDATE CASCADE;

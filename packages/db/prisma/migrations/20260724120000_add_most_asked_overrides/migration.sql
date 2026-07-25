-- CreateTable
CREATE TABLE "MostAskedOverride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "mostAsked" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MostAskedOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MostAskedOverride_userId_idx" ON "MostAskedOverride"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MostAskedOverride_userId_itemType_itemId_key" ON "MostAskedOverride"("userId", "itemType", "itemId");

-- AddForeignKey
ALTER TABLE "MostAskedOverride" ADD CONSTRAINT "MostAskedOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

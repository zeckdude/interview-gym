# 🏋️ Phase 1 Complete — Foundation

> Generated automatically after Phase 1 setup. You can delete this file at any time.

## What You Just Built

Hell yeah — Phase 1 is done. Here's what's now live and working:

- **Full monorepo** set up with Next.js 14, TypeScript, and Tailwind CSS
- **Headspace-inspired design system** with centralized tokens in `tailwind.config.ts` — swap the whole aesthetic later by editing one file
- **Clerk authentication** — sign in, sign up, and protected routes all working
- **Dashboard** with real stats pulled from your database
- **Challenge list** with filters and 5 fully working Backend challenges
- **Monaco editor** with JavaScript/TypeScript toggle
- **PostgreSQL on Railway** storing every attempt you make
- **5 Backend coding challenges** fully implemented and tested

## Services Used in This Phase

| Service | Purpose | Dashboard |
|---------|---------|-----------|
| Clerk | Authentication | clerk.com/dashboard |
| Railway | PostgreSQL database | railway.app |
| Vercel | Frontend hosting | vercel.com/dashboard |

## How to Get Your API Keys (if you haven't already)

### Clerk
1. Go to [clerk.com](https://clerk.com) and sign in
2. Click "Create Application" → name it "Interview Gym"
3. Choose "Email" and/or "Google" as the sign-in methods
4. Go to "API Keys" in the left sidebar
5. Copy the "Publishable Key" (starts with `pk_`) → paste into `.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
6. Copy the "Secret Key" (starts with `sk_`) → paste into `.env.local` as `CLERK_SECRET_KEY`

### Google Sign-In

**Local dev:** Enable Google under **Configure → SSO connections** in Clerk. Leave "Use custom credentials" off — Clerk's shared dev credentials work on localhost. No Google Cloud setup needed.

**Production:** Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com), then paste the Client ID and Client Secret into Clerk's Google connection settings (with "Use custom credentials" on). Full step-by-step is in the README under **Step 4b**.

### Railway (PostgreSQL)
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Empty Project" → name it `interview-gym`
3. Click "+ New" → "Database" → "PostgreSQL"
4. Wait ~30 seconds for it to provision
5. Click the PostgreSQL service → go to "Variables" tab
6. Copy the `DATABASE_URL` value → paste into `.env.local`
7. Run `npx prisma migrate dev --name init` to create your tables

## What's Next

Phase 2 loads all 60 challenges and 40 questions, wires up the full challenge and question list pages, and adds search and sorting. Head to `phases/phase-02-all-content.md` when you're ready.

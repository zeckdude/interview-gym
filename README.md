# 🏋️ Interview Gym

**Your personal coding challenge platform for crushing technical interviews.**

Interview Gym is a full-stack web app that helps senior frontend engineers prepare for technical interviews with interactive coding challenges, conceptual questions, interactive lessons, an AI coaching assistant, and a timed interview simulator. Think of it like a gym for your interview skills — the more you show up, the sharper you get.

---

## What's in Here

- **60 coding challenges** across Backend, Frontend Essential, and Frontend Advanced
- **40 conceptual questions** covering Backend and Frontend concepts
- **Interactive lessons** that teach you the concept before you tackle the challenge
- **AI coach** that nudges you in the right direction without giving away the answer
- **Interview simulator** — timed mock interviews with AI feedback
- **Streak tracking** and gamification to keep you motivated
- **Spaced repetition** so you review the right things at the right time

---

## Tech Stack (Plain English)

| What | Tool | Why |
|------|------|-----|
| Web framework | Next.js 14 | Handles both the frontend UI and backend API in one project |
| Language | TypeScript | JavaScript with types — catches bugs before you run the code |
| Styling | Tailwind CSS | Utility classes that make styling fast and consistent |
| Code editor | Monaco Editor | The same editor that powers VS Code, running in the browser |
| Auth | Clerk | Handles sign-in, sign-up, and user sessions so you don't have to build it |
| Database | PostgreSQL on Railway | Stores your attempts, progress, and preferences |
| ORM | Prisma | Lets you talk to the database using TypeScript instead of raw SQL |
| AI | Anthropic Claude | Powers the coaching, code review, and improvement features |
| Email | Resend | Sends your practice reminders |

---

## Prerequisites

Before you start, make sure you have these installed on your computer:

### Node.js
Node.js is the JavaScript runtime that runs this project. You need version 18 or higher.

**Check if you have it:**
```bash
node --version
# Should print something like: v20.11.0
```

**If you don't have it:** Go to [nodejs.org](https://nodejs.org) and download the "LTS" version. Install it like any other app.

### npm
npm comes with Node.js automatically. Check it:
```bash
npm --version
# Should print something like: 10.2.4
```

### Git
Git is how you save and version your code.
```bash
git --version
# Should print something like: git version 2.42.0
```

**If you don't have it:** Go to [git-scm.com](https://git-scm.com) and install it.

---

## First-Time Setup

Follow these steps in order. Don't skip any — each one sets up something the next step needs.

### Step 1: Clone the Repository

Open your terminal (Terminal on Mac, Command Prompt or PowerShell on Windows) and run:

```bash
git clone https://github.com/YOUR_USERNAME/interview-gym.git
cd interview-gym
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Install Dependencies

```bash
npm install
```

This downloads all the libraries the project needs. It may take a minute or two — that's normal.

### Step 3: Set Up Your Environment Variables

Environment variables are secret values (like passwords and API keys) that your app needs to run. They are NEVER committed to GitHub — they live only on your computer and on the servers where you deploy.

First, create your local environment file at the **project root** (not inside `apps/web`):

```bash
cp .env.example .env.local
npm run setup
```

The `setup` command links your root `.env.local` into `apps/web/` so Next.js (and Clerk middleware) can read it.

Now open `.env.local` in your code editor. You'll see a list of empty variables. You need to fill these in. Instructions for each one follow below.

### Step 4: Set Up Clerk (Authentication)

Clerk handles sign-in and sign-up so you don't have to build it yourself.

1. Go to [clerk.com](https://clerk.com) and create a free account (or sign in if you have one)
2. Click **"Create Application"**
3. Name it **"Interview Gym"**
4. Under "How will your users sign in?", enable **Email** and **Google** (or whichever methods you prefer)
5. Click **"Create Application"**
6. You'll land on a page showing your API keys
7. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`) and paste it as:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```
8. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`) and paste it as:
   ```
   CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
   ```

### Step 4b: Set Up Google Sign-In (Optional for Local Dev, Required for Production)

**Short answer:** For local development, you usually do **not** need a Google Cloud project. Clerk provides shared Google credentials in test mode — just enable Google in the Clerk Dashboard and it should work.

**When you do need Google Cloud:** Before deploying to production (or if Google sign-in fails locally), you'll create your own OAuth app and plug the credentials into Clerk.

#### Local development (the easy path)

1. In the [Clerk Dashboard](https://dashboard.clerk.com), open your **Interview Gym** application
2. Go to **Configure → SSO connections** (or **User & Authentication → Social connections**)
3. Click **Google** (or **Add connection → Google**)
4. Make sure **Enable for sign-up and sign-in** is turned on
5. Leave **Use custom credentials** turned **off** for now — Clerk's shared dev credentials handle localhost
6. Save, restart your dev server (`npm run dev`), and try **Continue with Google** on the sign-in page

That's it for local dev. No Google Cloud Console setup required.

#### Production (custom Google OAuth credentials)

Clerk's shared Google credentials only work in development. Before you deploy to Vercel, set up your own Google OAuth app:

1. **In Clerk Dashboard** (keep this tab open):
   - Go to **Configure → SSO connections → Google**
   - Turn on **Use custom credentials**
   - Copy the **Authorized Redirect URI** Clerk shows you — you'll need it in step 4

2. **In [Google Cloud Console](https://console.cloud.google.com)**:
   - Create a new project (or select an existing one), e.g. `interview-gym`
   - Open the menu (☰) → **APIs & Services → OAuth consent screen**
   - Choose **External** user type, fill in the app name (`Interview Gym`), and your email
   - Add `clerk.com` and your production domain under **Authorized domains** if prompted
   - Save through the consent screen wizard

3. **Create OAuth credentials**:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Interview Gym`
   - **Authorized JavaScript origins** — add:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs** — paste the **Authorized Redirect URI** from Clerk (it looks like `https://accounts.clerk.dev/v1/oauth_callback`)
   - Click **Create** and copy the **Client ID** and **Client Secret**

4. **Back in Clerk Dashboard**:
   - Paste the **Client ID** and **Client Secret** into the Google connection settings
   - Save

5. **Publish the OAuth app** (when ready for real users):
   - In Google Cloud Console → **OAuth consent screen**, change publishing status from **Testing** to **In production**
   - While in Testing mode, only Google accounts you add as test users can sign in

> **Note:** Interview Gym does not need any Google env vars in `.env.local`. Google OAuth is configured entirely in the Clerk Dashboard — our code just renders Clerk's sign-in UI and handles the callback routes.

### Step 5: Set Up PostgreSQL on Railway

Railway hosts your database in the cloud so your progress is saved.

1. Go to [railway.app](https://railway.app) and sign in (use GitHub login — it's easiest)
2. Click **"New Project"** (top right)
3. Click **"Empty Project"**
4. Click the project name at the top and rename it to **"interview-gym"**
5. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
6. Wait about 30 seconds while Railway sets up your database
7. Click the **PostgreSQL** block that appeared
8. Click the **"Variables"** tab
9. Find the row labeled **`DATABASE_URL`** and click the copy icon next to the value
10. Paste it into `.env.local`:
    ```
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.railway.app:PORT/railway
    ```

### Step 6: Set Up Your Database Tables

Now that the database exists, you need to create the tables inside it. Run:

```bash
npm run db:migrate
```

What this does: Prisma reads your schema file and creates the tables in your PostgreSQL database. You should see output that says `All migrations have been applied.`

### Step 7: Start the Development Server

```bash
npm run dev
```

Open your browser and go to [http://localhost:3000](http://localhost:3000)

You should see the Interview Gym sign-in page. Create an account and you'll land on the dashboard.

**If something doesn't work:** Check that all variables in `.env.local` are filled in correctly. The most common issue is a missing or incorrect API key.

---

## Project Structure (What Everything Is)

```
interview-gym/
├── apps/web/              # The main Next.js application
│   ├── app/               # Pages and API routes
│   ├── components/        # Reusable UI components
│   ├── data/              # All challenge and question content (hardcoded)
│   └── lib/               # Utility functions and service clients
├── packages/db/           # Database schema (Prisma)
├── phases/                # Documentation for each phase of development
├── tailwind.config.ts     # ALL design tokens live here (colors, fonts, spacing)
├── .env.example           # Template showing which env vars are needed
├── .env.local             # YOUR actual secret values (never committed to git)
└── README.md              # This file
```

---

## Useful Commands

```bash
npm run dev          # Start the local development server
npm run build        # Build for production
npm run db:migrate   # Apply database schema changes
npm run db:studio    # Open a visual browser for your database (great for debugging)
npm run db:reset     # ⚠️ Wipe and recreate the database (you'll lose all data)
npm run type-check   # Check for TypeScript errors without building
```

---

## Changing the Design

All colors, fonts, and spacing are defined in `tailwind.config.ts`. To change the look of the entire app:

1. Open `tailwind.config.ts`
2. Find the `colors` section under `theme.extend`
3. Update the hex values for the semantic tokens (e.g., change `brand` from `#FF6B35` to whatever your new brand color is)
4. Save the file — changes appear immediately in the browser

The design swap instructions are included as comments directly in `tailwind.config.ts`.

---

## Deploying to Production

### Deploy the Frontend (Vercel)

1. Push your code to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"Add New Project"**
4. Import your `interview-gym` GitHub repository
5. Under **"Environment Variables"**, add all the same variables from your `.env.local`
6. Click **"Deploy"**

Vercel automatically redeploys every time you push to `main`.

### The Database

Your Railway PostgreSQL database is already accessible from anywhere — Railway handles that automatically. Just make sure your `DATABASE_URL` in Vercel's environment variables matches the one from Railway.

---

## Troubleshooting

**"Cannot find module" errors:** Run `npm install` again. A dependency may be missing.

**"PrismaClientInitializationError":** Your `DATABASE_URL` is wrong or the database isn't running. Check Railway to make sure the PostgreSQL service is running.

**Clerk "Invalid API key":** Double check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are correct and don't have extra spaces.

**Google sign-in fails or redirects to an error:** In Clerk Dashboard, confirm Google is enabled under SSO connections. For local dev, leave "Use custom credentials" off. For production, verify your Google Cloud redirect URI exactly matches the one Clerk provides (no trailing slashes).

**Google sign-in works locally but not in production:** You need custom Google OAuth credentials — see Step 4b in the README.

**Page shows blank/white:** Open browser DevTools (F12), look at the Console tab for red error messages.

**Still stuck?** Run `npm run type-check` and fix any TypeScript errors first — they often cause the build to silently fail.

---

## Phase Progress

| Phase | Status | What It Adds |
|-------|--------|-------------|
| Phase 1 | ✅ Done | Foundation, design system, auth, dashboard, 5 challenges |
| Phase 2 | ⏳ Next | All 60 challenges + 40 questions, full content |
| Phase 3 | 🔒 Locked | Interactive lessons with mini-challenges |
| Phase 4 | 🔒 Locked | Streaks, badges, spaced repetition |
| Phase 5 | 🔒 Locked | AI coach, code review, improvement suggestions |
| Phase 6 | 🔒 Locked | Interview prep simulator |
| Phase 7 | 🔒 Locked | Leaderboard, weak spot analyzer, export |
| Phase 8 | 🔒 Locked | Email reminders, Railway cron |
| Phase 9 | 🔒 Locked | Notes, annotations, hint mechanic |
| Phase 10 | 🔒 Locked | User-generated challenges via AI |

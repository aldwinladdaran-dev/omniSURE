# Omnisure — MVP Setup Guide

This is the 11-step MVP from your spec: Register → Login → Add Prospect → Manage Prospect →
Convert to Client → View Client Profile → Complete FNA → Select Presentation/Product →
Schedule Follow-Up → Track Follow-Up → Logout.

## What's already built
- `app/` — every page (sign-in, dashboard, prospects, client profile, FNA calculator, follow-ups)
- `supabase/schema.sql` — the 4 database tables + security rules (run this once)
- `lib/`, `middleware.ts` — Clerk login wiring + secure Supabase connection
- `.env.example` — the exact keys you need to fill in

## Setup order (do this once)

### 1. Supabase — create your database
1. Go to supabase.com → New Project → name it `omnisure`.
2. Once it's ready, open **SQL Editor → New Query**.
3. Paste the entire contents of `supabase/schema.sql` and click **Run**.
   This creates your 4 tables: prospects, clients, fna_records, follow_ups.
4. Go to **Settings → API**. Copy the **Project URL** and the **anon public key**.

### 2. Clerk — create your login system
1. Go to clerk.com → Create Application → name it `omnisure`.
2. Go to **API Keys**. Copy the **Publishable key** and **Secret key**.
3. Important: Go to **Configure → Sessions → Customize session token**, and add this claim
   so Supabase can recognize the logged-in advisor:
   ```
   { "sub": "{{user.id}}" }
   ```
   (This is what makes Row Level Security work — each advisor only ever sees their own data.)
4. In Supabase: go to **Authentication → Sign In / Providers → Third Party Auth**, and connect
   Clerk as your provider (paste your Clerk domain). This is what links the two systems together.

### 3. Fill in your environment variables
Copy `.env.example` to `.env.local` and paste in the 4 keys you copied above.
When you deploy to Vercel, paste the same 4 keys into Vercel's **Settings → Environment Variables**.

### 4. Push to GitHub, deploy on Vercel
1. Push this whole project to your `omnisure` GitHub repo.
2. On vercel.com, **Import Project** → pick the repo → paste in your env variables → Deploy.
3. Vercel gives you a live URL. Every time new code is pushed to GitHub, it updates automatically.

## Your day-to-day loop from here
Tell Claude Code what to change in plain English (e.g. "add a notes field to the client profile"),
it edits the code and pushes to GitHub, Vercel redeploys automatically. You never need a terminal.

## What's intentionally NOT built yet (by design)
AI assistant, advisor ranking, public Omninetwork, client ratings, multi-tenant agencies,
custom branding. These are Phase 2+. Get 5–10 real advisors using this skeleton first.

# CLUTCH – Supabase Backend Guide

This directory contains database migrations, schemas, and configurations for the **CLUTCH** mobile application.

---

## 🗄️ Database Architecture & Tables

| Table | Description | Key Relations |
|-------|-------------|---------------|
| `profiles` | User profile linked to `auth.users` | `id` -> `auth.users(id)` |
| `game_accounts` | Linked game accounts (MLBB, LoL, Valorant) | `user_id` -> `profiles(id)` |
| `game_matches` | Recent match history (last 5+ matches) | `game_account_id` -> `game_accounts(id)` |
| `teams` | Competitive squads & rosters | `owner_id` -> `profiles(id)` |
| `team_members` | Team roster memberships & roles | `team_id` -> `teams(id)`, `user_id` -> `profiles(id)` |
| `team_applications`| Player applications to join teams | `team_id` -> `teams(id)`, `applicant_id` -> `profiles(id)` |
| `coaches` | Coach listings, rates, rating & game specialty | `user_id` -> `profiles(id)` |
| `coach_bookings` | Coaching sessions booked by players | `coach_id` -> `coaches(id)`, `student_id` -> `profiles(id)` |
| `tournaments` | Tournaments, prize pools & deadlines | `organizer_id` -> `profiles(id)` |
| `tournament_registrations` | Teams registered in tournaments | `tournament_id`, `team_id`, `registered_by` |
| `notifications` | User notifications (invites, matches, system)| `user_id` -> `profiles(id)` |

---

## 🚀 Setup Instructions

### 1. Create a Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New Project** and choose a name (e.g. `clutch-prod`) and database password.
3. Select a region close to your target users (e.g., Frankfurt / Central EU).

### 2. Apply Database Migrations
You have two options:

#### Option A: Supabase Dashboard (Fastest - 1 Click)
1. Open your project on the Supabase Dashboard.
2. In the left navigation, click **SQL Editor**.
3. Click **New Query**.
4. Open [supabase/schema.sql](./schema.sql), copy the entire file content, paste it into the editor, and click **Run**.
5. All 11 tables, enum types, indexes, update triggers, and Row Level Security (RLS) policies will be applied.

#### Option B: Supabase CLI
```bash
# Login to Supabase CLI
npx supabase login

# Link your remote project (find reference ID in Project Settings)
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push
```

### 3. Configure Mobile App Environment Variables
1. Go to your Supabase Project Settings: **Project Settings -> API**.
2. Copy the **Project URL** and the **`anon` `public` key**.
3. Create or update `.env.local` in the project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

> ⚠️ **SECURITY WARNING:**
> Never expose your `service_role` key in `.env.local` or frontend code. The `EXPO_PUBLIC_SUPABASE_ANON_KEY` is safe for client applications because all data access is gated by Postgres Row Level Security (RLS) policies.

---

## 🔒 Row Level Security (RLS) Summary

Every table has RLS enabled with strict policies:
- **Public Reads:** `profiles`, `teams`, `team_members`, `coaches`, `tournaments`, and `tournament_registrations` are publicly viewable by authenticated/guest users.
- **Private Data:** `game_accounts`, `game_matches`, `coach_bookings`, `team_applications`, and `notifications` can only be viewed by the owning user or authorized participants.
- **Mutation Guards:** Only owners/creators can update or delete their respective resources.

---

## 📱 Mobile App Supabase Client

The reusable client is initialized in:
`src/lib/supabase.ts`

- Uses `expo-secure-store` for native encrypted credential & session persistence on iOS and Android.
- Provides fallback to `localStorage` on web.
- Includes `isSupabaseConfigured()` helper to gracefully fall back to mock/demo data when credentials are not yet configured.
- Full TypeScript types are available in `src/types/database.ts`.

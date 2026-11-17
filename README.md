# 🎮 CLUTCH — Esports Team & Coach Matchmaking Platform

[![Expo](https://img.shields.io/badge/Expo-SDK_58-black.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.88.1-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com)
[![Expo Router](https://img.shields.io/badge/Router-Expo_Router_58-000000.svg?style=flat)](https://docs.expo.dev/router/introduction/)

> **"Analyze. Adapt. Dominate."**  
> A next-generation competitive mobile esports platform designed to help gamers find compatible teammates, build squads, connect with certified coaches, and compete in tournaments based on their exact game, rank, and in-game role.

---

## 📌 Table of Contents
- [Project Overview & Purpose](#-project-overview--purpose)
- [Core Features](#-core-features)
- [Navigation & User Flow](#-navigation--user-flow)
- [Design System (Design Tokens)](#-design-system-design-tokens)
- [Technology Architecture (Tech Stack)](#-technology-architecture-tech-stack)
- [Backend & Database Architecture (PostgreSQL Schema)](#-backend--database-architecture-postgresql-schema)
- [Data Fetching & State Management](#-data-fetching--state-management)
- [Project Directory Structure](#-project-directory-structure)
- [Installation & Getting Started](#-installation--getting-started)
- [Development Roadmap](#-development-roadmap)

---

## 🎯 Project Overview & Purpose

In competitive online gaming—especially team-centric titles like **Mobile Legends: Bang Bang (MLBB)**, Valorant, and Wild Rift—players frequently face major hurdles when queuing solo: role overlap, mismatched skill ranks, toxic environments, and a lack of structured communication.

**CLUTCH** solves this problem by delivering a dedicated, esports-first ecosystem:
1. **Role & Rank Matchmaking:** Teams post recruitment listings for exact missing roles (e.g. EXP Lane, Roamer, Jungler), allowing qualified players to apply instantly.
2. **Coach Marketplace:** Players aiming to climb ranks can browse verified coaches, review past accomplishments, inspect hourly rates, and book training sessions.
3. **Tournament Registration:** Squads can discover upcoming community and regional tournaments, view prize pools, and register with one tap.
4. **Player Performance Card:** Displays live competitive stats, rank badges, win-rates, MVP awards, and recent match KDA metrics.

---

## 🌟 Core Features

- **Dashboard / Home:** Recent match history cards (KDA, MVP badge, match outcome), overall performance stats (win rate, total matches), and quick-action navigation.
- **Find a Team:** Real-time filter chips (Game, Rank, Role, Age), team detail cards, regional rankings, and one-tap application submission.
- **Find a Coach:** Mentor profiles, specialties, years of coaching experience, session pricing, and direct booking invitations.
- **My Team:** 5-player starting roster plus coach roles, team management, roster status, and team departure actions.
- **Tournaments:** Prize pool details, rules, registration slots, schedule dates, and squad entry confirmation.
- **Interactive Notifications:** Categorized alerts for team invitations, coaching approvals, scrim requests, and tournament check-ins.
- **Player Profile & Info:** Deep-dive statistical breakdown, champion pool, match history, and profile management.
- **Settings:** Notifications toggle, Dark Mode switch, privacy permissions, platform guidelines, and logout.
- **Authentication:** Mock-ready login and registration flow supporting Google Sign-In, Discord Sign-In, and credentials.

---

## 📱 Navigation & User Flow

The application starts on the **Login Screen** and transitions into the protected **4-Tab Navigation** with modal sub-screens:

```
                  ┌──────────────────────┐
                  │   Login / Register   │  ◄── Initial Entry Screen
                  └──────────┬───────────┘
                             │ (Authenticated)
     ┌───────────────────────┴───────────────────────┐
     │                                               │
┌────▼─────────────────┐                   ┌─────────▼────────────┐
│   (tabs) Navigator   │                   │     Sub-Screens      │
├──────────────────────┤                   ├──────────────────────┤
│ 🏠 Home (Dashboard)  │                   │ 🎯 Find Coach        │
│ 👥 Teams (Team List) │ ◄───────────────► │ 🛡️ My Team           │
│ 🏆 Tournaments       │                   │ 🔔 Notifications     │
│ 👤 Profile & Stats   │                   │ ℹ️ Player Info       │
└──────────────────────┘                   │ ⚙️ Settings          │
                                           └──────────────────────┘
```

---

## 🎨 Design System (Design Tokens)

The app utilizes a centralized, retro-modern design system configured in `src/constants/theme.ts`:

| Token | Value | Description |
| :--- | :--- | :--- |
| **`background`** | `#FFEBF3` | Soft pastel gaming background inspired by Figma |
| **`card`** | `#FFFFFF` | Clean white card surface with outline |
| **`cardBorder`** | `#962B2B` | Deep crimson brutalist border |
| **`primary`** | `#FF5C9D` | Vibrant Clutch pink accent |
| **`primaryDark`** | `#962B2B` | Action buttons, headers, and active indicators |
| **`primaryLight`** | `#FFE1ED` | Chip backgrounds and active icon capsules |
| **`secondary`** | `#0004E4` | Interactive link color |
| **`success`** | `#10B981` | Victory badges and active status indicators |
| **`gold`** | `#FFB800` | MVP and 5-star rating ornaments |
| **`retroShadow`** | `offset: -3, 4` | Elevated drop shadow styling |

---

## 🏗️ Technology Architecture (Tech Stack)

### Frontend
- **Framework:** [React Native 0.88.1](https://reactnative.dev)
- **Runtime:** [Expo SDK 58](https://expo.dev)
- **Routing:** [Expo Router v58](https://docs.expo.dev/router/introduction/) (File-based Native Stack & Tabs)
- **Language:** TypeScript 6.0 (Strict mode)
- **Iconography:** `@expo/vector-icons` (Ionicons)
- **Styling:** React Native `StyleSheet` with centralized `ClutchTheme` tokens
- **Code Quality:** ESLint 9 (Strict React Hooks rules), `tsc` type checking

---

## 💾 Backend & Database Architecture (PostgreSQL Schema)

For real-time squad invitations, coach bookings, relational team rosters, and authentication, **Supabase (PostgreSQL + Realtime + Auth)** is the recommended architecture.

### 🌟 Why Supabase?
1. **Relational Data Integrity (PostgreSQL):** Players, teams, rosters, applications, and tournaments have strict relational dependencies that benefit from foreign keys and cascade rules.
2. **Built-in Authentication:** Out-of-the-box support for **Google** and **Discord** OAuth providers matching the login UI.
3. **Realtime WebSockets:** Instant push updates for team invitations, scrim notifications, and coaching requests without manual polling.
4. **Row Level Security (RLS):** Granular database-level access policies ensuring users can only edit their own profile and managed teams.

---

### 📊 Production Database Schema (PostgreSQL)

```sql
-- 1. USER PROFILES (Extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    primary_game VARCHAR(50) DEFAULT 'MLBB',
    rank VARCHAR(50) DEFAULT 'Mythic Immortal',
    main_role VARCHAR(30) DEFAULT 'EXP Lane',
    total_matches INT DEFAULT 0,
    win_rate NUMERIC(5,2) DEFAULT 0.0,
    mvp_count INT DEFAULT 0,
    favorite_heroes TEXT[] DEFAULT ARRAY['Benedetta', 'Chou'],
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEAMS TABLE
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    tag VARCHAR(10),
    captain_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    game VARCHAR(50) NOT NULL DEFAULT 'MLBB',
    essential_roles TEXT[] NOT NULL, -- e.g. ['Roamer', 'Jungler']
    rating NUMERIC(2,1) DEFAULT 5.0,
    description TEXT,
    max_members INT DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAM MEMBERS & ROSTER
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_in_team VARCHAR(30) NOT NULL, -- 'EXP', 'Jungler', 'Mid', 'Gold', 'Roamer', 'Coach'
    is_captain BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 4. TEAM APPLICATIONS & INVITES
CREATE TABLE team_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    applied_role VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COACHES TABLE
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    experience_years INT NOT NULL DEFAULT 1,
    hourly_fee VARCHAR(50) DEFAULT 'Free',
    specialty TEXT NOT NULL, -- 'Macro, Rotation & Draft'
    rating NUMERIC(2,1) DEFAULT 5.0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TOURNAMENTS TABLE
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    game VARCHAR(50) NOT NULL DEFAULT 'MLBB',
    prize_pool VARCHAR(100) NOT NULL,
    entry_fee VARCHAR(50) DEFAULT 'Free',
    max_teams INT DEFAULT 16,
    registered_teams INT DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL, -- 'team', 'coach', 'invite', 'other'
    title TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MATCH HISTORY TABLE
CREATE TABLE match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    hero_name VARCHAR(50) NOT NULL,
    result VARCHAR(10) NOT NULL, -- 'VICTORY', 'DEFEAT'
    kills INT DEFAULT 0,
    deaths INT DEFAULT 0,
    assists INT DEFAULT 0,
    role VARCHAR(30),
    is_mvp BOOLEAN DEFAULT FALSE,
    played_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚡ Data Fetching & State Management

Recommended client-side data stack:

1. **`@supabase/supabase-js`:**
   - Official client SDK for Auth, database queries, and file storage.
2. **`@tanstack/react-query` (TanStack Query v5):**
   - **Cache Management:** Instant tab transitions without redundant network requests.
   - **Optimistic Updates:** Instant UI feedback on team applications or notification dismissal before backend round-trips complete.
   - **State Handling:** Clean abstractions for `isLoading`, `isError`, and automatic background refetching.
3. **`zustand` (Lightweight Global State):**
   - Manages client session state, active game preferences, and search filters.

---

## 📂 Project Directory Structure

```
clutch/
├── assets/                  # Images, branding icons, and font assets
├── src/
│   ├── app/                 # Expo Router file-based screens
│   │   ├── _layout.tsx      # Root Stack Navigator & AuthProvider
│   │   ├── login.tsx        # 🔑 Initial Login & Register Screen
│   │   ├── (tabs)/          # Protected Main App Tabs
│   │   │   ├── _layout.tsx  # Custom Bottom Tab Bar with Redirect guard
│   │   │   ├── index.tsx    # 🏠 Home / Dashboard
│   │   │   ├── teams.tsx    # 👥 Find a Team & Applications
│   │   │   ├── tournaments.tsx # 🏆 Tournaments & Registrations
│   │   │   └── profile.tsx  # 👤 Player Profile & Account Menu
│   │   ├── find-coach.tsx   # 🎯 Coach Marketplace
│   │   ├── my-team.tsx      # 🛡️ Team Roster & Squad Management
│   │   ├── notifications.tsx# 🔔 Categorized Notification Center
│   │   ├── player-info.tsx  # ℹ️ Comprehensive Player Stats Card
│   │   └── settings.tsx     # ⚙️ Settings & Logout Action
│   ├── components/          # Modular Reusable Components
│   │   ├── clutch/
│   │   │   └── header.tsx   # Universal Clutch Header (Avatar, Search, Bell)
│   │   └── ui/              # Base UI building blocks
│   ├── constants/
│   │   └── theme.ts         # Centralized ClutchTheme tokens
│   ├── context/
│   │   └── auth-context.tsx # Authentication State & Session Context
│   └── hooks/               # Custom React hooks
├── AGENTS.md                # Development guidelines
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 🚀 Installation & Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
# Start on local Wi-Fi with cache reset (Recommended):
npx expo start -c

# Start in tunnel mode (for cellular data or restricted networks):
npx expo start --tunnel -c
```

Scan the terminal QR code with the **Expo Go (SDK 58)** app on your physical mobile device.

### 3. Verify Code Quality & Type Safety
```bash
# Run TypeScript type check:
npx tsc --noEmit

# Run ESLint validation:
npx eslint .

# Run Expo dependency doctor:
npx expo-doctor
```

---

## 🗺️ Development Roadmap

- [x] **Milestone 1: UI & Design Tokens:** Port Figma screens into React Native and Expo SDK 58 using strict mobile patterns.
- [x] **Milestone 2: Navigation & Flow:** Implement protected Stack and Tabs navigation with an initial Login Screen.
- [x] **Milestone 3: Complete English Localization:** Clean, 100% English interface across all screens, buttons, and alerts.
- [ ] **Milestone 4: Supabase Connection:** Initialize cloud project and connect `@supabase/supabase-js`.
- [ ] **Milestone 5: Production Auth:** Live Google and Discord OAuth token handling.
- [ ] **Milestone 6: Server State & Realtime:** Connect live team applications, coach bookings, and websocket notifications.

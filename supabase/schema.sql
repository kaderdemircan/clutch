-- ============================================================
-- CLUTCH – Consolidated PostgreSQL & Supabase Database Schema
-- ============================================================
-- You can run this file directly in the Supabase Dashboard:
-- SQL Editor -> New Query -> Paste & Run
-- ============================================================

-- ============================================================
-- 1. Custom Enum Types
-- ============================================================
CREATE TYPE public.supported_game AS ENUM ('mlbb', 'lol', 'valorant');
CREATE TYPE public.team_role AS ENUM ('owner', 'captain', 'member', 'substitute');
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'registration_open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.registration_status AS ENUM ('registered', 'checked_in', 'eliminated', 'withdrawn');
CREATE TYPE public.notification_type AS ENUM (
  'team_invite',
  'team_application',
  'match_result',
  'tournament_update',
  'coach_booking',
  'system'
);

-- ============================================================
-- Common Trigger Function for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. Profiles (Linked to auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url   TEXT,
  bio          TEXT,
  country      TEXT,
  primary_game public.supported_game,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_username ON public.profiles (username);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on auth.users INSERT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- 3. Game Accounts & Matches
-- ============================================================
CREATE TABLE public.game_accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game                public.supported_game NOT NULL,
  game_tag            TEXT NOT NULL,
  game_email          TEXT,
  region              TEXT,
  rank                TEXT,
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  last_synced_at      TIMESTAMPTZ,
  favorite_characters TEXT[] DEFAULT '{}',
  stats               JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_game_accounts_user_game ON public.game_accounts (user_id, game);
CREATE INDEX idx_game_accounts_user ON public.game_accounts (user_id);

CREATE TRIGGER game_accounts_updated_at
  BEFORE UPDATE ON public.game_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.game_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own game accounts"
  ON public.game_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game accounts"
  ON public.game_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game accounts"
  ON public.game_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own game accounts"
  ON public.game_accounts FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE public.game_matches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_account_id   UUID NOT NULL REFERENCES public.game_accounts(id) ON DELETE CASCADE,
  hero_or_agent     TEXT NOT NULL,
  result            TEXT NOT NULL CHECK (result IN ('VICTORY', 'DEFEAT')),
  kda               TEXT NOT NULL,
  role_or_position  TEXT NOT NULL,
  is_mvp            BOOLEAN NOT NULL DEFAULT false,
  score_or_rating   TEXT,
  stat_extra        TEXT,
  played_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_game_matches_account ON public.game_matches (game_account_id);
CREATE INDEX idx_game_matches_played ON public.game_matches (game_account_id, played_at DESC);

ALTER TABLE public.game_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own matches"
  ON public.game_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.game_accounts ga
      WHERE ga.id = game_account_id AND ga.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert matches for their accounts"
  ON public.game_matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.game_accounts ga
      WHERE ga.id = game_account_id AND ga.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own matches"
  ON public.game_matches FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.game_accounts ga
      WHERE ga.id = game_account_id AND ga.user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. Teams, Members & Applications
-- ============================================================
CREATE TABLE public.teams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  tag           TEXT NOT NULL,
  game          public.supported_game NOT NULL,
  logo_url      TEXT,
  description   TEXT,
  region        TEXT,
  is_recruiting BOOLEAN NOT NULL DEFAULT true,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_teams_tag_game ON public.teams (tag, game);
CREATE INDEX idx_teams_game ON public.teams (game);
CREATE INDEX idx_teams_owner ON public.teams (owner_id);
CREATE INDEX idx_teams_recruiting ON public.teams (is_recruiting) WHERE is_recruiting = true;

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are publicly readable"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their team"
  ON public.teams FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their team"
  ON public.teams FOR DELETE
  USING (auth.uid() = owner_id);

CREATE TABLE public.team_members (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id   UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role      public.team_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, user_id)
);

CREATE INDEX idx_team_members_team ON public.team_members (team_id);
CREATE INDEX idx_team_members_user ON public.team_members (user_id);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are publicly readable"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Team leaders can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('owner', 'captain')
    )
    OR
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );

CREATE POLICY "Members can leave or leaders can remove"
  ON public.team_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );

CREATE TABLE public.team_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id       UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  applicant_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message       TEXT,
  status        public.application_status NOT NULL DEFAULT 'pending',
  reviewed_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, applicant_id)
);

CREATE INDEX idx_team_applications_team ON public.team_applications (team_id);
CREATE INDEX idx_team_applications_applicant ON public.team_applications (applicant_id);
CREATE INDEX idx_team_applications_pending ON public.team_applications (team_id, status)
  WHERE status = 'pending';

CREATE TRIGGER team_applications_updated_at
  BEFORE UPDATE ON public.team_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own applications"
  ON public.team_applications FOR SELECT
  USING (
    auth.uid() = applicant_id
    OR EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can apply to teams"
  ON public.team_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Team owners can review applications"
  ON public.team_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );

-- ============================================================
-- 5. Coaches & Bookings
-- ============================================================
CREATE TABLE public.coaches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game            public.supported_game NOT NULL,
  specialty       TEXT,
  hourly_rate     NUMERIC(10, 2),
  currency        TEXT NOT NULL DEFAULT 'USD',
  bio             TEXT,
  rating          NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  total_sessions  INTEGER NOT NULL DEFAULT 0,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, game)
);

CREATE INDEX idx_coaches_game ON public.coaches (game);
CREATE INDEX idx_coaches_user ON public.coaches (user_id);
CREATE INDEX idx_coaches_available ON public.coaches (is_available) WHERE is_available = true;

CREATE TRIGGER coaches_updated_at
  BEFORE UPDATE ON public.coaches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches are publicly readable"
  ON public.coaches FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own coach profile"
  ON public.coaches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can update their profile"
  ON public.coaches FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can delete their profile"
  ON public.coaches FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE public.coach_bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id          UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at      TIMESTAMPTZ NOT NULL,
  duration_minutes  INTEGER NOT NULL DEFAULT 60,
  status            public.booking_status NOT NULL DEFAULT 'pending',
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coach_bookings_coach ON public.coach_bookings (coach_id);
CREATE INDEX idx_coach_bookings_student ON public.coach_bookings (student_id);
CREATE INDEX idx_coach_bookings_scheduled ON public.coach_bookings (scheduled_at);

CREATE TRIGGER coach_bookings_updated_at
  BEFORE UPDATE ON public.coach_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.coach_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their bookings"
  ON public.coach_bookings FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.coaches c
      WHERE c.id = coach_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create bookings"
  ON public.coach_bookings FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participants can update their bookings"
  ON public.coach_bookings FOR UPDATE
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.coaches c
      WHERE c.id = coach_id AND c.user_id = auth.uid()
    )
  );

-- ============================================================
-- 6. Tournaments & Registrations
-- ============================================================
CREATE TABLE public.tournaments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  game                  public.supported_game NOT NULL,
  description           TEXT,
  prize_pool            TEXT,
  max_teams             INTEGER NOT NULL DEFAULT 16,
  registration_deadline TIMESTAMPTZ,
  start_date            TIMESTAMPTZ NOT NULL,
  end_date              TIMESTAMPTZ,
  status                public.tournament_status NOT NULL DEFAULT 'upcoming',
  organizer_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rules_url             TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tournaments_game ON public.tournaments (game);
CREATE INDEX idx_tournaments_status ON public.tournaments (status);
CREATE INDEX idx_tournaments_start ON public.tournaments (start_date);
CREATE INDEX idx_tournaments_organizer ON public.tournaments (organizer_id);

CREATE TRIGGER tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournaments are publicly readable"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their tournament"
  ON public.tournaments FOR UPDATE
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their tournament"
  ON public.tournaments FOR DELETE
  USING (auth.uid() = organizer_id);

CREATE TABLE public.tournament_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id         UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  registered_by   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          public.registration_status NOT NULL DEFAULT 'registered',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tournament_id, team_id)
);

CREATE INDEX idx_tourn_reg_tournament ON public.tournament_registrations (tournament_id);
CREATE INDEX idx_tourn_reg_team ON public.tournament_registrations (team_id);
CREATE INDEX idx_tourn_reg_user ON public.tournament_registrations (registered_by);

ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tournament registrations are publicly readable"
  ON public.tournament_registrations FOR SELECT
  USING (true);

CREATE POLICY "Team owners or leaders can register team for tournament"
  ON public.tournament_registrations FOR INSERT
  WITH CHECK (
    auth.uid() = registered_by
    AND (
      EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = team_id AND t.owner_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.team_id = team_id
          AND tm.user_id = auth.uid()
          AND tm.role IN ('owner', 'captain')
      )
    )
  );

CREATE POLICY "Organizers or registrants can update registration status"
  ON public.tournament_registrations FOR UPDATE
  USING (
    auth.uid() = registered_by
    OR EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Registrant or organizer can delete registration"
  ON public.tournament_registrations FOR DELETE
  USING (
    auth.uid() = registered_by
    OR EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- ============================================================
-- 7. Notifications
-- ============================================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        public.notification_type NOT NULL DEFAULT 'system',
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB DEFAULT '{}',
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications (user_id);
CREATE INDEX idx_notifications_unread ON public.notifications (user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users or services can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can mark their own notifications as read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

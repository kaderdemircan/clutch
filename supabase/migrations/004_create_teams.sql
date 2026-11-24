-- ============================================================
-- CLUTCH – Migration 004: Teams, Members & Applications
-- ============================================================

-- ----- Teams -----
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

-- Anyone can browse teams
CREATE POLICY "Teams are publicly readable"
  ON public.teams FOR SELECT
  USING (true);

-- Only authenticated users can create teams
CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only the owner can update their team
CREATE POLICY "Owners can update their team"
  ON public.teams FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Only the owner can delete their team
CREATE POLICY "Owners can delete their team"
  ON public.teams FOR DELETE
  USING (auth.uid() = owner_id);


-- ----- Team Members -----
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

-- Anyone can see team rosters
CREATE POLICY "Team members are publicly readable"
  ON public.team_members FOR SELECT
  USING (true);

-- Team owners/captains can add members
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

-- Members can leave (delete their own row); owners/captains can remove others
CREATE POLICY "Members can leave or leaders can remove"
  ON public.team_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );


-- ----- Team Applications -----
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

-- Applicants can see their own applications; team owners can see applications to their teams
CREATE POLICY "Users can see their own applications"
  ON public.team_applications FOR SELECT
  USING (
    auth.uid() = applicant_id
    OR EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );

-- Authenticated users can apply to teams
CREATE POLICY "Users can apply to teams"
  ON public.team_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Team owners can update application status
CREATE POLICY "Team owners can review applications"
  ON public.team_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
  );

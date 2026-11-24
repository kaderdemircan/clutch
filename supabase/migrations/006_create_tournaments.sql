-- ============================================================
-- CLUTCH – Migration 006: Tournaments & Tournament Registrations
-- ============================================================

-- ----- Tournaments -----
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

-- Anyone can browse tournaments
CREATE POLICY "Tournaments are publicly readable"
  ON public.tournaments FOR SELECT
  USING (true);

-- Authenticated users can organize tournaments
CREATE POLICY "Authenticated users can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update their tournament
CREATE POLICY "Organizers can update their tournament"
  ON public.tournaments FOR UPDATE
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Organizers can delete their tournament
CREATE POLICY "Organizers can delete their tournament"
  ON public.tournaments FOR DELETE
  USING (auth.uid() = organizer_id);


-- ----- Tournament Registrations -----
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

-- Anyone can see registered teams
CREATE POLICY "Tournament registrations are publicly readable"
  ON public.tournament_registrations FOR SELECT
  USING (true);

-- Team leaders/owners can register their team
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

-- Tournament organizers or team leaders can update registration status
CREATE POLICY "Organizers or registrants can update registration status"
  ON public.tournament_registrations FOR UPDATE
  USING (
    auth.uid() = registered_by
    OR EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- Registrant or organizer can cancel registration
CREATE POLICY "Registrant or organizer can delete registration"
  ON public.tournament_registrations FOR DELETE
  USING (
    auth.uid() = registered_by
    OR EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

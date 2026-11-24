-- ============================================================
-- CLUTCH – Migration 003: Game Accounts & Match History
-- ============================================================

-- ----- Game Accounts -----
CREATE TABLE public.game_accounts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game              public.supported_game NOT NULL,
  game_tag          TEXT NOT NULL,
  game_email        TEXT,
  region            TEXT,
  rank              TEXT,
  is_verified       BOOLEAN NOT NULL DEFAULT false,
  last_synced_at    TIMESTAMPTZ,
  favorite_characters TEXT[] DEFAULT '{}',
  stats             JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One account per game per user
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


-- ----- Game Matches (last N match history) -----
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

-- Users can read matches belonging to their own game accounts
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

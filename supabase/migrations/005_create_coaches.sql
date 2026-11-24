-- ============================================================
-- CLUTCH – Migration 005: Coaches & Coaching Bookings
-- ============================================================

-- ----- Coaches Profile / Listing -----
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

-- Anyone can view available coaches
CREATE POLICY "Coaches are publicly readable"
  ON public.coaches FOR SELECT
  USING (true);

-- Authenticated users can register as a coach
CREATE POLICY "Users can create their own coach profile"
  ON public.coaches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Coaches can update their own profile
CREATE POLICY "Coaches can update their profile"
  ON public.coaches FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Coaches can delete their own coach profile
CREATE POLICY "Coaches can delete their profile"
  ON public.coaches FOR DELETE
  USING (auth.uid() = user_id);


-- ----- Coach Bookings -----
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

-- Both coach and student can view their bookings
CREATE POLICY "Participants can view their bookings"
  ON public.coach_bookings FOR SELECT
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.coaches c
      WHERE c.id = coach_id AND c.user_id = auth.uid()
    )
  );

-- Students can create bookings
CREATE POLICY "Students can create bookings"
  ON public.coach_bookings FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Both coach and student can update booking status (e.g. confirm, cancel)
CREATE POLICY "Participants can update their bookings"
  ON public.coach_bookings FOR UPDATE
  USING (
    auth.uid() = student_id
    OR EXISTS (
      SELECT 1 FROM public.coaches c
      WHERE c.id = coach_id AND c.user_id = auth.uid()
    )
  );

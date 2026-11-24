-- ============================================================
-- CLUTCH – Migration 007: Notifications System
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

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users or system triggers can insert notifications
CREATE POLICY "Users or services can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can mark their own notifications as read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

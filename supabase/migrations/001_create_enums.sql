-- ============================================================
-- CLUTCH – Migration 001: Custom PostgreSQL Enum Types
-- ============================================================
-- Run in Supabase SQL Editor (or via supabase db push).
-- These enums are referenced by all subsequent tables.
-- ============================================================

-- Game identifiers
CREATE TYPE public.supported_game AS ENUM ('mlbb', 'lol', 'valorant');

-- Team membership roles
CREATE TYPE public.team_role AS ENUM ('owner', 'captain', 'member', 'substitute');

-- Application lifecycle
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Coach booking lifecycle
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Tournament lifecycle
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'registration_open', 'in_progress', 'completed', 'cancelled');

-- Tournament registration states
CREATE TYPE public.registration_status AS ENUM ('registered', 'checked_in', 'eliminated', 'withdrawn');

-- Notification categories
CREATE TYPE public.notification_type AS ENUM (
  'team_invite',
  'team_application',
  'match_result',
  'tournament_update',
  'coach_booking',
  'system'
);

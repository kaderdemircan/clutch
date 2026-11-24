// ============================================================
// CLUTCH – Supabase / PostgreSQL Database Type Definitions
// ============================================================
// Matches the Supabase schema and migrations in supabase/migrations/
// Compatible with @supabase/supabase-js v2 GenericSchema
// ============================================================

export type SupportedGame = 'mlbb' | 'lol' | 'valorant';

export type TeamRole = 'owner' | 'captain' | 'member' | 'substitute';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type TournamentStatus = 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
export type RegistrationStatus = 'registered' | 'checked_in' | 'eliminated' | 'withdrawn';
export type NotificationType =
  | 'team_invite'
  | 'team_application'
  | 'match_result'
  | 'tournament_update'
  | 'coach_booking'
  | 'system';

// ---------------------------------------------------------------------------
// Row types – one per table
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string; // references auth.users(id)
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  primary_game: SupportedGame | null;
  created_at: string;
  updated_at: string;
}

export interface GameAccountRow {
  id: string;
  user_id: string;
  game: SupportedGame;
  game_tag: string;
  game_email: string | null;
  region: string | null;
  rank: string | null;
  is_verified: boolean;
  last_synced_at: string | null;
  favorite_characters: string[];
  stats: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GameMatchRow {
  id: string;
  game_account_id: string;
  hero_or_agent: string;
  result: 'VICTORY' | 'DEFEAT';
  kda: string;
  role_or_position: string;
  is_mvp: boolean;
  score_or_rating: string | null;
  stat_extra: string | null;
  played_at: string;
  created_at: string;
}

export interface TeamRow {
  id: string;
  name: string;
  tag: string;
  game: SupportedGame;
  logo_url: string | null;
  description: string | null;
  region: string | null;
  is_recruiting: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberRow {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
}

export interface TeamApplicationRow {
  id: string;
  team_id: string;
  applicant_id: string;
  message: string | null;
  status: ApplicationStatus;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoachRow {
  id: string;
  user_id: string;
  game: SupportedGame;
  specialty: string | null;
  hourly_rate: number | null;
  currency: string;
  bio: string | null;
  rating: number;
  total_sessions: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoachBookingRow {
  id: string;
  coach_id: string;
  student_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TournamentRow {
  id: string;
  name: string;
  game: SupportedGame;
  description: string | null;
  prize_pool: string | null;
  max_teams: number;
  registration_deadline: string | null;
  start_date: string;
  end_date: string | null;
  status: TournamentStatus;
  organizer_id: string;
  rules_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistrationRow {
  id: string;
  tournament_id: string;
  team_id: string;
  registered_by: string;
  status: RegistrationStatus;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Insert types
// ---------------------------------------------------------------------------

export interface ProfileInsert {
  id: string;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  country?: string | null;
  primary_game?: SupportedGame | null;
  created_at?: string;
  updated_at?: string;
}

export interface GameAccountInsert {
  id?: string;
  user_id: string;
  game: SupportedGame;
  game_tag: string;
  game_email?: string | null;
  region?: string | null;
  rank?: string | null;
  is_verified?: boolean;
  last_synced_at?: string | null;
  favorite_characters?: string[];
  stats?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface GameMatchInsert {
  id?: string;
  game_account_id: string;
  hero_or_agent: string;
  result: 'VICTORY' | 'DEFEAT';
  kda: string;
  role_or_position: string;
  is_mvp?: boolean;
  score_or_rating?: string | null;
  stat_extra?: string | null;
  played_at?: string;
  created_at?: string;
}

export interface TeamInsert {
  id?: string;
  name: string;
  tag: string;
  game: SupportedGame;
  logo_url?: string | null;
  description?: string | null;
  region?: string | null;
  is_recruiting?: boolean;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMemberInsert {
  id?: string;
  team_id: string;
  user_id: string;
  role?: TeamRole;
  joined_at?: string;
}

export interface TeamApplicationInsert {
  id?: string;
  team_id: string;
  applicant_id: string;
  message?: string | null;
  status?: ApplicationStatus;
  reviewed_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CoachInsert {
  id?: string;
  user_id: string;
  game: SupportedGame;
  specialty?: string | null;
  hourly_rate?: number | null;
  currency?: string;
  bio?: string | null;
  rating?: number;
  total_sessions?: number;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CoachBookingInsert {
  id?: string;
  coach_id: string;
  student_id: string;
  scheduled_at: string;
  duration_minutes?: number;
  status?: BookingStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TournamentInsert {
  id?: string;
  name: string;
  game: SupportedGame;
  description?: string | null;
  prize_pool?: string | null;
  max_teams?: number;
  registration_deadline?: string | null;
  start_date: string;
  end_date?: string | null;
  status?: TournamentStatus;
  organizer_id: string;
  rules_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TournamentRegistrationInsert {
  id?: string;
  tournament_id: string;
  team_id: string;
  registered_by: string;
  status?: RegistrationStatus;
  created_at?: string;
}

export interface NotificationInsert {
  id?: string;
  user_id: string;
  type?: NotificationType;
  title: string;
  body?: string | null;
  data?: Record<string, unknown> | null;
  is_read?: boolean;
  created_at?: string;
}

export interface GenericRelationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

// ---------------------------------------------------------------------------
// Supabase Database helper type (used by createClient<Database>)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: GenericRelationship[];
      };
      game_accounts: {
        Row: GameAccountRow;
        Insert: GameAccountInsert;
        Update: Partial<GameAccountInsert>;
        Relationships: GenericRelationship[];
      };
      game_matches: {
        Row: GameMatchRow;
        Insert: GameMatchInsert;
        Update: Partial<GameMatchInsert>;
        Relationships: GenericRelationship[];
      };
      teams: {
        Row: TeamRow;
        Insert: TeamInsert;
        Update: Partial<TeamInsert>;
        Relationships: GenericRelationship[];
      };
      team_members: {
        Row: TeamMemberRow;
        Insert: TeamMemberInsert;
        Update: Partial<TeamMemberInsert>;
        Relationships: GenericRelationship[];
      };
      team_applications: {
        Row: TeamApplicationRow;
        Insert: TeamApplicationInsert;
        Update: Partial<TeamApplicationInsert>;
        Relationships: GenericRelationship[];
      };
      coaches: {
        Row: CoachRow;
        Insert: CoachInsert;
        Update: Partial<CoachInsert>;
        Relationships: GenericRelationship[];
      };
      coach_bookings: {
        Row: CoachBookingRow;
        Insert: CoachBookingInsert;
        Update: Partial<CoachBookingInsert>;
        Relationships: GenericRelationship[];
      };
      tournaments: {
        Row: TournamentRow;
        Insert: TournamentInsert;
        Update: Partial<TournamentInsert>;
        Relationships: GenericRelationship[];
      };
      tournament_registrations: {
        Row: TournamentRegistrationRow;
        Insert: TournamentRegistrationInsert;
        Update: Partial<TournamentRegistrationInsert>;
        Relationships: GenericRelationship[];
      };
      notifications: {
        Row: NotificationRow;
        Insert: NotificationInsert;
        Update: Partial<NotificationInsert>;
        Relationships: GenericRelationship[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      supported_game: SupportedGame;
      team_role: TeamRole;
      application_status: ApplicationStatus;
      booking_status: BookingStatus;
      tournament_status: TournamentStatus;
      registration_status: RegistrationStatus;
      notification_type: NotificationType;
    };
  };
}

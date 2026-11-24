import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type SupportedGame = 'mlbb' | 'lol' | 'valorant';

export interface GameMatch {
  id: string;
  heroOrAgent: string;
  result: 'VICTORY' | 'DEFEAT';
  kda: string;
  roleOrPosition: string;
  isMvp?: boolean;
  scoreOrRating?: string;
  statExtra?: string;
}

export interface GameAccount {
  game: SupportedGame;
  gameTitle: string;
  gameEmail: string;
  gameTag: string;
  region: string;
  rank: string;
  isVerified: boolean;
  lastSyncedAt: string;
  favoriteCharacters: string[];
  matches: GameMatch[];
  stats: {
    winRate: string;
    totalMatches: number;
    mvpCount: number;
    killAvg: string;
    deathAvg: string;
    assistAvg: string;
    secondaryMetricLabel: string;
    secondaryMetricValue: string;
  };
}

export const GAME_PRESETS: Record<
  SupportedGame,
  {
    title: string;
    defaultRank: string;
    defaultRegion: string;
    favoriteCharacters: string[];
    stats: GameAccount['stats'];
    matches: GameMatch[];
  }
> = {
  mlbb: {
    title: 'Mobile Legends: Bang Bang',
    defaultRank: 'Mythic Immortal (124 Stars)',
    defaultRegion: 'Global / TR',
    favoriteCharacters: ['Benedetta', 'Chou', 'Paquito'],
    stats: {
      winRate: '64%',
      totalMatches: 218,
      mvpCount: 32,
      killAvg: '19.8',
      deathAvg: '2.5',
      assistAvg: '5.8',
      secondaryMetricLabel: 'Push Rate',
      secondaryMetricValue: '74%',
    },
    matches: [
      { id: 'm1', heroOrAgent: 'Benedetta', result: 'VICTORY', kda: '24 / 3 / 4', roleOrPosition: 'EXP Lane', isMvp: true, statExtra: '18.2k Gold' },
      { id: 'm2', heroOrAgent: 'Chou', result: 'VICTORY', kda: '18 / 2 / 6', roleOrPosition: 'EXP Lane', isMvp: true, statExtra: '14.5k Gold' },
      { id: 'm3', heroOrAgent: 'Paquito', result: 'VICTORY', kda: '21 / 4 / 5', roleOrPosition: 'EXP Lane', isMvp: false, statExtra: '16.0k Gold' },
      { id: 'm4', heroOrAgent: 'Benedetta', result: 'VICTORY', kda: '16 / 1 / 8', roleOrPosition: 'EXP Lane', isMvp: false, statExtra: '15.1k Gold' },
      { id: 'm5', heroOrAgent: 'Fanny', result: 'DEFEAT', kda: '12 / 6 / 3', roleOrPosition: 'Jungler', isMvp: false, statExtra: '12.8k Gold' },
    ],
  },
  lol: {
    title: 'League of Legends',
    defaultRank: 'Grandmaster (480 LP)',
    defaultRegion: 'EU West',
    favoriteCharacters: ['Ahri', 'Jinx', 'Yasuo'],
    stats: {
      winRate: '67%',
      totalMatches: 284,
      mvpCount: 46,
      killAvg: '11.4',
      deathAvg: '3.1',
      assistAvg: '8.6',
      secondaryMetricLabel: 'CS/Min',
      secondaryMetricValue: '8.9',
    },
    matches: [
      { id: 'l1', heroOrAgent: 'Ahri', result: 'VICTORY', kda: '14 / 2 / 9', roleOrPosition: 'Mid Lane', isMvp: true, statExtra: '248 CS' },
      { id: 'l2', heroOrAgent: 'Jinx', result: 'VICTORY', kda: '19 / 3 / 7', roleOrPosition: 'Bot Lane', isMvp: true, statExtra: '312 CS' },
      { id: 'l3', heroOrAgent: 'Yasuo', result: 'VICTORY', kda: '11 / 4 / 8', roleOrPosition: 'Mid Lane', isMvp: false, statExtra: '260 CS' },
      { id: 'l4', heroOrAgent: 'Lee Sin', result: 'VICTORY', kda: '9 / 1 / 14', roleOrPosition: 'Jungler', isMvp: false, statExtra: '185 CS' },
      { id: 'l5', heroOrAgent: 'Sylas', result: 'DEFEAT', kda: '8 / 7 / 5', roleOrPosition: 'Mid Lane', isMvp: false, statExtra: '194 CS' },
    ],
  },
  valorant: {
    title: 'Valorant',
    defaultRank: 'Immortal 3 (310 RR)',
    defaultRegion: 'Frankfurt',
    favoriteCharacters: ['Jett', 'Reyna', 'Omen'],
    stats: {
      winRate: '62%',
      totalMatches: 195,
      mvpCount: 39,
      killAvg: '21.6',
      deathAvg: '11.2',
      assistAvg: '6.4',
      secondaryMetricLabel: 'Headshot %',
      secondaryMetricValue: '34.2%',
    },
    matches: [
      { id: 'v1', heroOrAgent: 'Jett', result: 'VICTORY', kda: '28 / 11 / 4', roleOrPosition: 'Duelist', isMvp: true, statExtra: 'ACS 342' },
      { id: 'v2', heroOrAgent: 'Reyna', result: 'VICTORY', kda: '24 / 13 / 6', roleOrPosition: 'Duelist', isMvp: true, statExtra: 'ACS 298' },
      { id: 'v3', heroOrAgent: 'Omen', result: 'VICTORY', kda: '18 / 9 / 12', roleOrPosition: 'Controller', isMvp: false, statExtra: 'ACS 245' },
      { id: 'v4', heroOrAgent: 'Sova', result: 'VICTORY', kda: '15 / 8 / 16', roleOrPosition: 'Initiator', isMvp: false, statExtra: 'ACS 215' },
      { id: 'v5', heroOrAgent: 'Jett', result: 'DEFEAT', kda: '22 / 18 / 3', roleOrPosition: 'Duelist', isMvp: false, statExtra: 'ACS 260' },
    ],
  },
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AppUser | null;
  session: Session | null;
  gameAccount: GameAccount | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    username?: string
  ) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  linkGameAccount: (params: {
    game: SupportedGame;
    gameEmail: string;
    gameTag: string;
    region?: string;
  }) => Promise<void>;
  unlinkGameAccount: () => Promise<void>;
  login: (email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  gameAccount: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  linkGameAccount: async () => {},
  unlinkGameAccount: async () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [gameAccount, setGameAccount] = useState<GameAccount | null>(null);

  // Helper to sync user profile with Supabase PostgreSQL database
  const syncProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const email = supabaseUser.email ?? '';
      const fallbackName = email ? email.split('@')[0] : 'Player';

      // 1. Fetch profile from public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (profile) {
        setUser({
          id: supabaseUser.id,
          name: profile.display_name || profile.username || fallbackName,
          email,
          avatarUrl: profile.avatar_url,
        });
      } else {
        // Create profile row if it doesn't exist yet
        const username =
          (supabaseUser.user_metadata?.username as string) || fallbackName.toLowerCase();
        const displayName =
          (supabaseUser.user_metadata?.display_name as string) || fallbackName;

        await supabase.from('profiles').upsert({
          id: supabaseUser.id,
          username,
          display_name: displayName,
        });

        setUser({
          id: supabaseUser.id,
          name: displayName,
          email,
        });
      }

      // 2. Fetch linked game account from public.game_accounts
      const { data: dbGameAccount } = await supabase
        .from('game_accounts')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (dbGameAccount) {
        const gameKey = dbGameAccount.game as SupportedGame;
        const preset = GAME_PRESETS[gameKey] || GAME_PRESETS.mlbb;

        setGameAccount({
          game: gameKey,
          gameTitle: preset.title,
          gameEmail: dbGameAccount.game_email || email,
          gameTag: dbGameAccount.game_tag,
          region: dbGameAccount.region || preset.defaultRegion,
          rank: dbGameAccount.rank || preset.defaultRank,
          isVerified: dbGameAccount.is_verified,
          lastSyncedAt: dbGameAccount.last_synced_at
            ? new Date(dbGameAccount.last_synced_at).toLocaleDateString()
            : 'Recently',
          favoriteCharacters:
            dbGameAccount.favorite_characters && dbGameAccount.favorite_characters.length > 0
              ? dbGameAccount.favorite_characters
              : preset.favoriteCharacters,
          matches: preset.matches,
          stats:
            dbGameAccount.stats && Object.keys(dbGameAccount.stats).length > 0
              ? (dbGameAccount.stats as any)
              : preset.stats,
        });
      }
    } catch (err) {
      console.warn('Profile synchronization error:', err);
      // Fallback local user
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.email ? supabaseUser.email.split('@')[0] : 'Player',
        email: supabaseUser.email ?? 'player@clutch.gg',
      });
    }
  };

  // Restore session on app launch
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }

        if (initialSession?.user && isMounted) {
          setSession(initialSession);
          setIsAuthenticated(true);
          await syncProfile(initialSession.user);
        }
      } catch (err) {
        console.warn('Failed to restore session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);

        if (newSession?.user) {
          setIsAuthenticated(true);
          await syncProfile(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
          setGameAccount(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Real Email & Password Sign In
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setIsAuthenticated(true);
        await syncProfile(data.user);
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Login failed') };
    }
  };

  // Real User Registration
  const signUp = async (
    email: string,
    password: string,
    username?: string
  ): Promise<{ error: Error | null; needsEmailConfirmation?: boolean }> => {
    try {
      const trimmedEmail = email.trim();
      const autoUsername = username?.trim() || trimmedEmail.split('@')[0];

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            username: autoUsername,
            display_name: autoUsername,
          },
        },
      });

      if (error) {
        return { error: new Error(error.message), needsEmailConfirmation: false };
      }

      const needsConfirmation = !data.session;

      if (data.session && data.user) {
        setSession(data.session);
        setIsAuthenticated(true);
        await syncProfile(data.user);
      }

      return { error: null, needsEmailConfirmation: needsConfirmation };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Registration failed'), needsEmailConfirmation: false };
    }
  };

  // Real Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    } finally {
      setSession(null);
      setUser(null);
      setGameAccount(null);
      setIsAuthenticated(false);
    }
  };

  // Real Password Reset
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        return { error: new Error(error.message) };
      }
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Password reset failed') };
    }
  };

  // Legacy/Demo login helper for backwards compatibility
  const login = (email?: string) => {
    const defaultEmail = email || 'player@clutch.gg';
    setUser({
      id: 'demo-user-id',
      name: defaultEmail.split('@')[0],
      email: defaultEmail,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    signOut();
  };

  // Game account linking (updates state + persists to PostgreSQL)
  const linkGameAccount = async ({
    game,
    gameEmail,
    gameTag,
    region,
  }: {
    game: SupportedGame;
    gameEmail: string;
    gameTag: string;
    region?: string;
  }) => {
    const preset = GAME_PRESETS[game];
    const formattedTag = gameTag || `${user?.name || 'Player'}#${game.toUpperCase()}`;
    const formattedRegion = region || preset.defaultRegion;

    const newAccount: GameAccount = {
      game,
      gameTitle: preset.title,
      gameEmail,
      gameTag: formattedTag,
      region: formattedRegion,
      rank: preset.defaultRank,
      isVerified: true,
      lastSyncedAt: 'Just now',
      favoriteCharacters: preset.favoriteCharacters,
      matches: preset.matches,
      stats: preset.stats,
    };

    setGameAccount(newAccount);

    // Persist to Supabase if user is logged in
    if (user?.id && user.id !== 'demo-user-id') {
      try {
        await supabase.from('game_accounts').upsert({
          user_id: user.id,
          game,
          game_tag: formattedTag,
          game_email: gameEmail,
          region: formattedRegion,
          rank: preset.defaultRank,
          is_verified: true,
          last_synced_at: new Date().toISOString(),
          favorite_characters: preset.favoriteCharacters,
          stats: preset.stats as any,
        });
      } catch (err) {
        console.warn('Could not persist game account to Supabase:', err);
      }
    }
  };

  const unlinkGameAccount = async () => {
    setGameAccount(null);
    if (user?.id && user.id !== 'demo-user-id' && gameAccount) {
      try {
        await supabase
          .from('game_accounts')
          .delete()
          .eq('user_id', user.id)
          .eq('game', gameAccount.game);
      } catch (err) {
        console.warn('Could not remove game account from Supabase:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        session,
        gameAccount,
        signIn,
        signUp,
        signOut,
        resetPassword,
        linkGameAccount,
        unlinkGameAccount,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

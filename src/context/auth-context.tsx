import { createContext, useContext, useState, ReactNode } from 'react';

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

export const GAME_PRESETS: Record<SupportedGame, {
  title: string;
  defaultRank: string;
  defaultRegion: string;
  favoriteCharacters: string[];
  stats: GameAccount['stats'];
  matches: GameMatch[];
}> = {
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

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email?: string) => void;
  logout: () => void;
  user: { name: string; email: string } | null;
  gameAccount: GameAccount | null;
  linkGameAccount: (params: {
    game: SupportedGame;
    gameEmail: string;
    gameTag: string;
    region?: string;
  }) => void;
  unlinkGameAccount: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  user: null,
  gameAccount: null,
  linkGameAccount: () => {},
  unlinkGameAccount: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [gameAccount, setGameAccount] = useState<GameAccount | null>(null);

  const login = (email?: string) => {
    setUser({
      name: email ? email.split('@')[0] : 'Player',
      email: email || 'player@clutch.gg',
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setGameAccount(null);
    setIsAuthenticated(false);
  };

  const linkGameAccount = ({
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
    setGameAccount({
      game,
      gameTitle: preset.title,
      gameEmail,
      gameTag: gameTag || `${user?.name || 'Player'}#${game.toUpperCase()}`,
      region: region || preset.defaultRegion,
      rank: preset.defaultRank,
      isVerified: true,
      lastSyncedAt: 'Just now',
      favoriteCharacters: preset.favoriteCharacters,
      matches: preset.matches,
      stats: preset.stats,
    });
  };

  const unlinkGameAccount = () => {
    setGameAccount(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        gameAccount,
        linkGameAccount,
        unlinkGameAccount,
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

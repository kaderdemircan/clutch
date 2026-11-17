import '@/global.css';
import { Platform } from 'react-native';

export const ClutchTheme = {
  colors: {
    // Clutch visual palette
    background: '#FFEBF3', // Soft pastel blush gaming background
    backgroundAlt: '#FFF5F9',
    card: '#FFFFFF',
    cardBorder: '#962B2B', // Crimson outline
    cardBorderLight: 'rgba(150, 43, 43, 0.25)',
    primary: '#FF5C9D', // Clutch pink
    primaryDark: '#962B2B', // Deep crimson accent
    primaryLight: '#FFE1ED',
    secondary: '#0004E4', // Blue link accent
    text: '#161314',
    textSecondary: '#5A4E54',
    textMuted: '#8C7E85',
    textPink: '#FF5C9D',
    white: '#FFFFFF',
    black: '#000000',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.18)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    gold: '#FFB800',
  },
  shadows: {
    retro: {
      shadowColor: '#000000',
      shadowOffset: { width: -3, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    subtle: {
      shadowColor: '#962B2B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    pill: 999,
  },
};

export const Colors = {
  light: {
    text: ClutchTheme.colors.text,
    background: ClutchTheme.colors.background,
    backgroundElement: ClutchTheme.colors.card,
    backgroundSelected: ClutchTheme.colors.primaryLight,
    textSecondary: ClutchTheme.colors.textSecondary,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A0E15',
    backgroundElement: '#2B1723',
    backgroundSelected: '#421E33',
    textSecondary: '#B8A6B0',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

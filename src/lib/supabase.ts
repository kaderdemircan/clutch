import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';


// ---------------------------------------------------------------------------
// Environment variables – these MUST be set in .env.local before the client
// can reach a real Supabase project.  The app continues to work in demo/mock
// mode without them (see auth-context.tsx).
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ---------------------------------------------------------------------------
// Secure storage adapter (native) / localStorage fallback (web)
// ---------------------------------------------------------------------------
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return Promise.resolve(localStorage.getItem(key));
      } catch {
        return Promise.resolve(null);
      }
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {
        // quota exceeded – silently ignore
      }
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// ---------------------------------------------------------------------------
// Supabase client singleton
// ---------------------------------------------------------------------------
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ---------------------------------------------------------------------------
// Helper: check whether the client has valid credentials configured.
// Use this in the app to decide between Supabase-backed and mock-data modes.
// ---------------------------------------------------------------------------
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('YOUR_PROJECT_REF') &&
    supabaseAnonKey.length > 0 &&
    !supabaseAnonKey.includes('your-supabase')
  );
}

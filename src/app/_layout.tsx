import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';

import { ClutchTheme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/auth-context';

function RouteProtection() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inLogin = segments[0] === 'login';

    if (!isAuthenticated && !inLogin) {
      // Unauthenticated user attempting to access protected route
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ClutchTheme.colors.background,
        }}>
        <ActivityIndicator size="large" color={ClutchTheme.colors.primaryDark} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="connect-game" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find-coach" options={{ headerShown: false }} />
      <Stack.Screen name="my-team" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="player-info" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="dark" />
        <RouteProtection />
      </ThemeProvider>
    </AuthProvider>
  );
}

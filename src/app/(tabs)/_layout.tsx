import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClutchTheme } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();
  const bottomPadding = Math.max(insets.bottom, 10);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ClutchTheme.colors.primaryDark,
        tabBarInactiveTintColor: ClutchTheme.colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 64 + bottomPadding,
            paddingBottom: bottomPadding,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={focused ? ClutchTheme.colors.primaryDark : (color as string)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Teams',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={23}
                color={focused ? ClutchTheme.colors.primaryDark : (color as string)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tournaments"
        options={{
          title: 'Tournaments',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? 'trophy' : 'trophy-outline'}
                size={22}
                color={focused ? ClutchTheme.colors.primaryDark : (color as string)}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={focused ? ClutchTheme.colors.primaryDark : (color as string)}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: ClutchTheme.colors.white,
    borderTopWidth: 1.5,
    borderTopColor: ClutchTheme.colors.cardBorderLight,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ClutchTheme.radius.pill,
  },
  activeIconContainer: {
    backgroundColor: ClutchTheme.colors.primaryLight,
  },
});

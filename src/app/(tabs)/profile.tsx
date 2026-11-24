import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClutchHeader } from '@/components/clutch/header';
import { ClutchTheme } from '@/constants/theme';
import { GAME_PRESETS, useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const { user, gameAccount } = useAuth();
  const displayName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Kader';

  const activeGame = gameAccount || {
    game: 'mlbb' as const,
    gameTitle: GAME_PRESETS.mlbb.title,
    gameEmail: user?.email || 'player@clutch.gg',
    gameTag: `${user?.name || 'Kader'}#MLBB`,
    region: GAME_PRESETS.mlbb.defaultRegion,
    rank: GAME_PRESETS.mlbb.defaultRank,
    isVerified: true,
    lastSyncedAt: 'Just now',
    favoriteCharacters: GAME_PRESETS.mlbb.favoriteCharacters,
    matches: GAME_PRESETS.mlbb.matches,
    stats: GAME_PRESETS.mlbb.stats,
  };

  const menuItems = [
    {
      id: 'game-account',
      title: 'Connected Game Account',
      subtitle: `${activeGame.gameTitle} (${activeGame.gameTag})`,
      icon: 'game-controller-outline',
      onPress: () => router.push('/connect-game'),
    },
    {
      id: 'edit',
      title: 'Edit Profile',
      subtitle: 'Change player card, main role & favorite hero',
      icon: 'person-outline',
      onPress: () => router.push('/player-info'),
    },
    {
      id: 'history',
      title: 'Match History & Analytics',
      subtitle: `View last ${activeGame.matches.length} matches analysis`,
      icon: 'time-outline',
      onPress: () => router.push('/player-info'),
    },
    {
      id: 'my-team',
      title: 'My Teams',
      subtitle: 'Manage Team Phoenix and member roles',
      icon: 'people-outline',
      onPress: () => router.push('/my-team'),
    },
    {
      id: 'coach',
      title: 'Coaching History',
      subtitle: 'Past sessions & booked mentors',
      icon: 'school-outline',
      onPress: () => router.push('/find-coach'),
    },
    {
      id: 'payments',
      title: 'Payments & Subscriptions',
      subtitle: 'Tournament prize receipts & coach fees',
      icon: 'card-outline',
      onPress: () => router.push('/settings'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Theme, notifications, privacy & logout',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
    },
  ];

  return (
    <View style={styles.container}>
      <ClutchHeader
        title="PROFILE"
        showSearch={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Player ID Card */}
        <View style={styles.playerCard}>
          <View style={styles.playerCardHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeInitial}>
                {displayName.charAt(0)}
              </Text>
            </View>
            <View style={styles.playerInfoBox}>
              <View style={styles.nameRow}>
                <Text style={styles.playerName}>{displayName}</Text>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>{activeGame.rank.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.gameDetailText}>
                {activeGame.gameTitle} • {activeGame.region}
              </Text>
              <Text style={styles.teamBadgeText}>Tag: {activeGame.gameTag}</Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{activeGame.stats.totalMatches}</Text>
              <Text style={styles.statCaption}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: ClutchTheme.colors.primaryDark }]}>
                {activeGame.stats.winRate}
              </Text>
              <Text style={styles.statCaption}>Win Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: ClutchTheme.colors.gold }]}>
                {activeGame.stats.mvpCount}
              </Text>
              <Text style={styles.statCaption}>MVP Award</Text>
            </View>
          </View>

          {/* Favorite Heroes / Agents */}
          <View style={styles.heroesSection}>
            <Text style={styles.heroesTitle}>Favorite Champions / Heroes:</Text>
            <View style={styles.heroChipsRow}>
              {activeGame.favoriteCharacters.map((hero) => (
                <View key={hero} style={styles.heroChip}>
                  <Ionicons name="shield-checkmark" size={12} color={ClutchTheme.colors.primaryDark} />
                  <Text style={styles.heroChipText}>{hero}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Buttons */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={styles.cardSecondaryBtn}
              onPress={() => router.push('/connect-game')}
              activeOpacity={0.7}>
              <Text style={styles.cardSecondaryBtnText}>Re-link Game 🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardPrimaryBtn}
              onPress={() => router.push('/player-info')}
              activeOpacity={0.8}>
              <Text style={styles.cardPrimaryBtnText}>Full Stats →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options */}
        <Text style={styles.menuTitle}>Account & Services</Text>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}>
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={ClutchTheme.colors.primaryDark}
                />
              </View>
              <View style={styles.menuTextBox}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={ClutchTheme.colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ClutchTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  playerCard: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    marginBottom: 24,
    ...ClutchTheme.shadows.retro,
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    ...ClutchTheme.shadows.subtle,
  },
  avatarLargeInitial: {
    fontSize: 28,
    fontWeight: '900',
    color: ClutchTheme.colors.primaryDark,
  },
  playerInfoBox: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  rankBadge: {
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorder,
  },
  rankBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  gameDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: ClutchTheme.colors.textSecondary,
    marginBottom: 2,
  },
  teamBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ClutchTheme.colors.primaryDark,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderRadius: ClutchTheme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statCol: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: ClutchTheme.colors.text,
  },
  statCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: ClutchTheme.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: ClutchTheme.colors.cardBorderLight,
  },
  heroesSection: {
    marginBottom: 16,
  },
  heroesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ClutchTheme.colors.textSecondary,
    marginBottom: 6,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ClutchTheme.radius.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  heroChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: ClutchTheme.colors.primaryDark,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cardSecondaryBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: ClutchTheme.radius.pill,
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  cardSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ClutchTheme.colors.textSecondary,
  },
  cardPrimaryBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: ClutchTheme.radius.pill,
    backgroundColor: ClutchTheme.colors.primaryDark,
  },
  cardPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: ClutchTheme.colors.white,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    overflow: 'hidden',
    ...ClutchTheme.shadows.retro,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ClutchTheme.colors.cardBorderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ClutchTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextBox: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: ClutchTheme.colors.textMuted,
    marginTop: 2,
  },
});

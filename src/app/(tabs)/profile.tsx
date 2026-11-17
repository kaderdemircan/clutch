import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DestinyHeader } from '@/components/destiny/header';
import { DestinyTheme } from '@/constants/theme';

export default function ProfileScreen() {
  const menuItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      subtitle: 'Change player card, main role & hero',
      icon: 'person-outline',
      onPress: () => router.push('/player-info'),
    },
    {
      id: 'history',
      title: 'Match History',
      subtitle: 'View detailed performance breakdown',
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
      <DestinyHeader
        title="PROFILE"
        showSearch={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Player ID Card from Screen 7 */}
        <View style={styles.playerCard}>
          <View style={styles.playerCardHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeInitial}>K</Text>
            </View>
            <View style={styles.playerInfoBox}>
              <View style={styles.nameRow}>
                <Text style={styles.playerName}>Kader</Text>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>MYTHIC IMMORTAL</Text>
                </View>
              </View>
              <Text style={styles.gameDetailText}>Game: MLBB • Main Role: EXP Lane</Text>
              <Text style={styles.teamBadgeText}>Team: TEAM PHOENIX (Captain)</Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>438</Text>
              <Text style={styles.statCaption}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: DestinyTheme.colors.primaryDark }]}>
                %61
              </Text>
              <Text style={styles.statCaption}>Win Rate</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statNumber, { color: DestinyTheme.colors.gold }]}>92</Text>
              <Text style={styles.statCaption}>MVP Award</Text>
            </View>
          </View>

          {/* Favorite Heroes */}
          <View style={styles.heroesSection}>
            <Text style={styles.heroesTitle}>Favorite Heroes:</Text>
            <View style={styles.heroChipsRow}>
              {['Benedetta', 'Chou', 'Paquito'].map((hero) => (
                <View key={hero} style={styles.heroChip}>
                  <Ionicons name="shield-checkmark" size={12} color={DestinyTheme.colors.primaryDark} />
                  <Text style={styles.heroChipText}>{hero}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Buttons */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity
              style={styles.cardSecondaryBtn}
              onPress={() => router.push('/my-team')}
              activeOpacity={0.7}>
              <Text style={styles.cardSecondaryBtnText}>View Team →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardPrimaryBtn}
              onPress={() => router.push('/player-info')}
              activeOpacity={0.8}>
              <Text style={styles.cardPrimaryBtnText}>Full Info →</Text>
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
                  color={DestinyTheme.colors.primaryDark}
                />
              </View>
              <View style={styles.menuTextBox}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={DestinyTheme.colors.textMuted}
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
    backgroundColor: DestinyTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  playerCard: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    marginBottom: 24,
    ...DestinyTheme.shadows.retro,
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
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: DestinyTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    ...DestinyTheme.shadows.subtle,
  },
  avatarLargeInitial: {
    fontSize: 28,
    fontWeight: '900',
    color: DestinyTheme.colors.primaryDark,
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
    color: DestinyTheme.colors.text,
  },
  rankBadge: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorder,
  },
  rankBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  gameDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: DestinyTheme.colors.textSecondary,
    marginBottom: 2,
  },
  teamBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: DestinyTheme.colors.primaryDark,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderRadius: DestinyTheme.radius.md,
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
    color: DestinyTheme.colors.text,
  },
  statCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: DestinyTheme.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: DestinyTheme.colors.cardBorderLight,
  },
  heroesSection: {
    marginBottom: 16,
  },
  heroesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: DestinyTheme.colors.textSecondary,
    marginBottom: 6,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: DestinyTheme.radius.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorderLight,
  },
  heroChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: DestinyTheme.colors.primaryDark,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cardSecondaryBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: DestinyTheme.radius.pill,
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorderLight,
  },
  cardSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: DestinyTheme.colors.textSecondary,
  },
  cardPrimaryBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: DestinyTheme.radius.pill,
    backgroundColor: DestinyTheme.colors.primaryDark,
  },
  cardPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: DestinyTheme.colors.white,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    overflow: 'hidden',
    ...DestinyTheme.shadows.retro,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: DestinyTheme.colors.cardBorderLight,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DestinyTheme.colors.primaryLight,
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
    color: DestinyTheme.colors.text,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: DestinyTheme.colors.textMuted,
    marginTop: 2,
  },
});

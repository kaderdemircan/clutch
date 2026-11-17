import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClutchHeader } from '@/components/clutch/header';
import { ClutchTheme } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function PlayerInfoScreen() {
  const { user } = useAuth();
  const displayName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Kader';

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile customizer will be unlocked in the next update.');
  };

  return (
    <View style={styles.container}>
      <ClutchHeader
        title="INFORMATION"
        showBack={true}
        showSearch={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Main Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardTop}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeInitial}>
                {displayName.charAt(0)}
              </Text>
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.brandTitle}>CLUTCH PLAYER</Text>
              <Text style={styles.playerName}>{displayName}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={ClutchTheme.colors.success} />
                  <Text style={styles.verifiedText}>Verified Competitor</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details Grid */}
          <View style={styles.dataList}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Game:</Text>
              <Text style={styles.dataValue}>Mobile Legends: Bang Bang</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Rank:</Text>
              <View style={styles.rankPill}>
                <Ionicons name="sparkles" size={13} color={ClutchTheme.colors.primaryDark} />
                <Text style={styles.rankPillText}>Mythic Immortal (124 Stars)</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Main Role:</Text>
              <Text style={styles.dataValueBold}>EXP Lane / Offlane</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Matches:</Text>
              <Text style={styles.dataValue}>438 Played</Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Win Rate:</Text>
              <Text style={[styles.dataValueBold, { color: ClutchTheme.colors.primaryDark }]}>
                61.4%
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>MVP Awards:</Text>
              <Text style={[styles.dataValueBold, { color: ClutchTheme.colors.gold }]}>
                92 Times
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Current Team:</Text>
              <TouchableOpacity onPress={() => router.push('/my-team')}>
                <Text style={styles.teamLink}>TEAM PHOENIX (Captain) →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Favorite Heroes */}
          <View style={styles.heroesContainer}>
            <Text style={styles.heroesHeader}>Favorite Heroes</Text>
            <View style={styles.heroesGrid}>
              {[
                { name: 'Benedetta', wr: '68%', matches: '184 M' },
                { name: 'Chou', wr: '62%', matches: '120 M' },
                { name: 'Paquito', wr: '59%', matches: '86 M' },
              ].map((hero) => (
                <View key={hero.name} style={styles.heroCard}>
                  <Ionicons name="shield" size={18} color={ClutchTheme.colors.primaryDark} />
                  <Text style={styles.heroName}>{hero.name}</Text>
                  <Text style={styles.heroStats}>
                    {hero.wr} • {hero.matches}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.viewTeamButton}
              onPress={() => router.push('/my-team')}
              activeOpacity={0.8}>
              <Text style={styles.viewTeamButtonText}>View team →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}>
              <Text style={styles.editProfileButtonText}>Edit profile →</Text>
            </TouchableOpacity>
          </View>
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
  infoCard: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    ...ClutchTheme.shadows.retro,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    ...ClutchTheme.shadows.subtle,
  },
  avatarLargeInitial: {
    fontSize: 30,
    fontWeight: '900',
    color: ClutchTheme.colors.primaryDark,
  },
  titleBox: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 1.2,
  },
  playerName: {
    fontSize: 22,
    fontWeight: '900',
    color: ClutchTheme.colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: ClutchTheme.colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1.5,
    backgroundColor: ClutchTheme.colors.cardBorderLight,
    marginVertical: 16,
  },
  dataList: {
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 13,
    color: ClutchTheme.colors.textSecondary,
    fontWeight: '600',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '700',
    color: ClutchTheme.colors.text,
  },
  dataValueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorder,
    gap: 4,
  },
  rankPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  teamLink: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  heroesContainer: {
    marginTop: 20,
  },
  heroesHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  heroesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  heroCard: {
    flex: 1,
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderRadius: ClutchTheme.radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  heroName: {
    fontSize: 12,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
    marginTop: 4,
  },
  heroStats: {
    fontSize: 10,
    color: ClutchTheme.colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 24,
  },
  viewTeamButton: {
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    borderRadius: ClutchTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  viewTeamButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  editProfileButton: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderRadius: ClutchTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    ...ClutchTheme.shadows.subtle,
  },
  editProfileButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.white,
  },
});

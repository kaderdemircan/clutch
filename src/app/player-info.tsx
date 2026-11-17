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

import { DestinyHeader } from '@/components/destiny/header';
import { DestinyTheme } from '@/constants/theme';

export default function PlayerInfoScreen() {
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing options will be available soon.');
  };

  return (
    <View style={styles.container}>
      <DestinyHeader
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
              <Text style={styles.avatarLargeInitial}>K</Text>
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.brandTitle}>DESTINY PLAYER</Text>
              <Text style={styles.playerName}>Kader</Text>
              <View style={styles.badgeRow}>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={DestinyTheme.colors.success} />
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
                <Ionicons name="sparkles" size={13} color={DestinyTheme.colors.primaryDark} />
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
              <Text style={[styles.dataValueBold, { color: DestinyTheme.colors.primaryDark }]}>
                %61.4
              </Text>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>MVP Awards:</Text>
              <Text style={[styles.dataValueBold, { color: DestinyTheme.colors.gold }]}>
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
                  <Ionicons name="shield" size={18} color={DestinyTheme.colors.primaryDark} />
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
    backgroundColor: DestinyTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  infoCard: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    ...DestinyTheme.shadows.retro,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: DestinyTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    ...DestinyTheme.shadows.subtle,
  },
  avatarLargeInitial: {
    fontSize: 30,
    fontWeight: '900',
    color: DestinyTheme.colors.primaryDark,
  },
  titleBox: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 1.2,
  },
  playerName: {
    fontSize: 22,
    fontWeight: '900',
    color: DestinyTheme.colors.text,
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
    color: DestinyTheme.colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1.5,
    backgroundColor: DestinyTheme.colors.cardBorderLight,
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
    color: DestinyTheme.colors.textSecondary,
    fontWeight: '600',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '700',
    color: DestinyTheme.colors.text,
  },
  dataValueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorder,
    gap: 4,
  },
  rankPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  teamLink: {
    fontSize: 13,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  heroesContainer: {
    marginTop: 20,
  },
  heroesHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  heroesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  heroCard: {
    flex: 1,
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderRadius: DestinyTheme.radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorderLight,
  },
  heroName: {
    fontSize: 12,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
    marginTop: 4,
  },
  heroStats: {
    fontSize: 10,
    color: DestinyTheme.colors.textMuted,
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
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    borderRadius: DestinyTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  viewTeamButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  editProfileButton: {
    backgroundColor: DestinyTheme.colors.primaryDark,
    borderRadius: DestinyTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    ...DestinyTheme.shadows.subtle,
  },
  editProfileButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: DestinyTheme.colors.white,
  },
});

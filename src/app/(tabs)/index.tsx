import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DestinyHeader } from '@/components/destiny/header';
import { DestinyTheme } from '@/constants/theme';

interface MatchData {
  id: string;
  hero: string;
  result: 'VICTORY' | 'DEFEAT';
  kda: string;
  role: string;
  isMvp?: boolean;
}

const RECENT_MATCHES: MatchData[] = [
  { id: '1', hero: 'Benedetta', result: 'VICTORY', kda: '24 / 3 / 4', role: 'EXP Lane', isMvp: true },
  { id: '2', hero: 'Benedetta', result: 'VICTORY', kda: '18 / 2 / 6', role: 'EXP Lane', isMvp: true },
  { id: '3', hero: 'Benedetta', result: 'VICTORY', kda: '21 / 4 / 5', role: 'EXP Lane', isMvp: false },
  { id: '4', hero: 'Benedetta', result: 'VICTORY', kda: '16 / 1 / 8', role: 'EXP Lane', isMvp: false },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <DestinyHeader
        title="PLAYER NAME"
        showSearch={true}
        searchPlaceholder="Search heroes, players, teams..."
        searchValue={search}
        onSearchChange={setSearch}
        unreadCount={3}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Game Banner */}
        <View style={styles.gameBanner}>
          <View style={styles.gameBadge}>
            <Text style={styles.gameBadgeDot}>●</Text>
            <Text style={styles.gameBadgeText}>RECENTLY PLAYED</Text>
          </View>
          <Text style={styles.gameTitle}>Mobile Legends: Bang Bang</Text>
          <Text style={styles.gameSubtitle}>Rank: Mythic Immortal • Server TR</Text>
        </View>

        {/* Last Four Matches Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LAST FOUR MATCH</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>4W - 0L (100%)</Text>
          </View>
        </View>

        <View style={styles.matchGrid}>
          {RECENT_MATCHES.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.matchCardTop}>
                <Text style={styles.heroName}>{match.hero}</Text>
                {match.isMvp && (
                  <View style={styles.mvpBadge}>
                    <Text style={styles.mvpText}>MVP</Text>
                  </View>
                )}
              </View>

              <View style={styles.resultBadge}>
                <Text style={styles.resultText}>{match.result}</Text>
              </View>

              <View style={styles.kdaRow}>
                <Ionicons name="flash" size={13} color={DestinyTheme.colors.primaryDark} />
                <Text style={styles.kdaText}>{match.kda}</Text>
              </View>

              <Text style={styles.roleText}>{match.role}</Text>
            </View>
          ))}
        </View>

        {/* Overall Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsLeft}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Kill Avg:</Text>
              <Text style={styles.statValue}>19.8</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Death Avg:</Text>
              <Text style={styles.statValue}>2.5</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Assist Avg:</Text>
              <Text style={styles.statValue}>5.8</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Push Rate:</Text>
              <Text style={styles.statValue}>74%</Text>
            </View>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.statsRight}>
            <Text style={styles.overallStatsTitle}>OVERALL STATS</Text>
            <View style={styles.statHighlightBadge}>
              <Text style={styles.statHighlightValue}>64%</Text>
              <Text style={styles.statHighlightLabel}>WIN RATE</Text>
            </View>
            <View style={styles.subStatsRow}>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatNum}>218</Text>
                <Text style={styles.miniStatLabel}>Matches</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatNum}>32</Text>
                <Text style={styles.miniStatLabel}>MVP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/teams')}
            activeOpacity={0.8}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="people" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <Text style={styles.actionButtonText}>Find a team</Text>
            <Ionicons name="arrow-forward" size={16} color={DestinyTheme.colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/find-coach')}
            activeOpacity={0.8}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="school" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <Text style={styles.actionButtonText}>Find a coach</Text>
            <Ionicons name="arrow-forward" size={16} color={DestinyTheme.colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/my-team')}
            activeOpacity={0.8}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="shield-checkmark" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <Text style={styles.actionButtonText}>My team</Text>
            <Ionicons name="arrow-forward" size={16} color={DestinyTheme.colors.primaryDark} />
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  gameBanner: {
    backgroundColor: DestinyTheme.colors.card,
    borderRadius: DestinyTheme.radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorderLight,
    ...DestinyTheme.shadows.subtle,
  },
  gameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  gameBadgeDot: {
    color: DestinyTheme.colors.success,
    fontSize: 12,
  },
  gameBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 1,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  gameSubtitle: {
    fontSize: 13,
    color: DestinyTheme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 1.2,
  },
  sectionBadge: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorderLight,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DestinyTheme.colors.primaryDark,
  },
  matchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  matchCard: {
    width: '48%',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    ...DestinyTheme.shadows.retro,
  },
  matchCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroName: {
    fontSize: 15,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  mvpBadge: {
    backgroundColor: DestinyTheme.colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mvpText: {
    color: DestinyTheme.colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  resultBadge: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  resultText: {
    color: DestinyTheme.colors.success,
    fontSize: 11,
    fontWeight: '800',
  },
  kdaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  kdaText: {
    fontSize: 13,
    fontWeight: '700',
    color: DestinyTheme.colors.text,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: DestinyTheme.colors.textMuted,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    marginBottom: 24,
    ...DestinyTheme.shadows.retro,
  },
  statsLeft: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DestinyTheme.colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  statsDivider: {
    width: 1.5,
    backgroundColor: DestinyTheme.colors.cardBorderLight,
    marginHorizontal: 8,
  },
  statsRight: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallStatsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 6,
  },
  statHighlightBadge: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    borderRadius: DestinyTheme.radius.md,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  statHighlightValue: {
    fontSize: 22,
    fontWeight: '900',
    color: DestinyTheme.colors.primaryDark,
  },
  statHighlightLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 0.8,
  },
  subStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatNum: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  miniStatLabel: {
    fontSize: 10,
    color: DestinyTheme.colors.textMuted,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.white,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    borderRadius: DestinyTheme.radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...DestinyTheme.shadows.retro,
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DestinyTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
    letterSpacing: 0.5,
  },
});

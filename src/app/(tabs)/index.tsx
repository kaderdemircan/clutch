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

import { ClutchHeader } from '@/components/clutch/header';
import { ClutchTheme } from '@/constants/theme';
import { GAME_PRESETS, useAuth } from '@/context/auth-context';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const { user, gameAccount } = useAuth();

  // Use linked account or default to MLBB preset
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

  const playerName = user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Player';

  return (
    <View style={styles.container}>
      <ClutchHeader
        title={playerName.toUpperCase()}
        showSearch={true}
        searchPlaceholder={`Search ${activeGame.gameTitle} heroes, teammates...`}
        searchValue={search}
        onSearchChange={setSearch}
        unreadCount={3}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Game Account Link / Sync Bar */}
        <TouchableOpacity
          style={styles.linkedAccountBar}
          onPress={() => router.push('/connect-game')}
          activeOpacity={0.8}>
          <View style={styles.linkedLeft}>
            <View style={styles.onlineDot} />
            <View>
              <Text style={styles.linkedTitle}>
                {activeGame.gameTitle} • <Text style={styles.linkedTag}>{activeGame.gameTag}</Text>
              </Text>
              <Text style={styles.linkedSubtitle}>
                Account Verified • Last 5 Matches Synced
              </Text>
            </View>
          </View>

          <View style={styles.switchGameBtn}>
            <Text style={styles.switchGameText}>Switch / Re-sync</Text>
            <Ionicons name="refresh" size={14} color={ClutchTheme.colors.primaryDark} />
          </View>
        </TouchableOpacity>

        {/* Game Banner */}
        <View style={styles.gameBanner}>
          <View style={styles.gameBadge}>
            <Text style={styles.gameBadgeDot}>●</Text>
            <Text style={styles.gameBadgeText}>LIVE GAME DATA</Text>
          </View>
          <Text style={styles.gameTitle}>{activeGame.gameTitle}</Text>
          <Text style={styles.gameSubtitle}>
            Rank: {activeGame.rank} • Region: {activeGame.region}
          </Text>
        </View>

        {/* Recent Matches Section (Last 5 Matches Analyzed) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LAST MATCHES (RECENT ANALYSIS)</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>
              {activeGame.matches.filter((m) => m.result === 'VICTORY').length}W -{' '}
              {activeGame.matches.filter((m) => m.result === 'DEFEAT').length}L
            </Text>
          </View>
        </View>

        <View style={styles.matchGrid}>
          {activeGame.matches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.matchCardTop}>
                <Text style={styles.heroName} numberOfLines={1}>
                  {match.heroOrAgent}
                </Text>
                {match.isMvp && (
                  <View style={styles.mvpBadge}>
                    <Text style={styles.mvpText}>MVP</Text>
                  </View>
                )}
              </View>

              <View
                style={[
                  styles.resultBadge,
                  match.result === 'DEFEAT' && styles.defeatBadge,
                ]}>
                <Text
                  style={[
                    styles.resultText,
                    match.result === 'DEFEAT' && styles.defeatText,
                  ]}>
                  {match.result}
                </Text>
              </View>

              <View style={styles.kdaRow}>
                <Ionicons name="flash" size={13} color={ClutchTheme.colors.primaryDark} />
                <Text style={styles.kdaText}>{match.kda}</Text>
              </View>

              <View style={styles.cardBottomRow}>
                <Text style={styles.roleText}>{match.roleOrPosition}</Text>
                {match.statExtra && (
                  <Text style={styles.extraStatText}>{match.statExtra}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Overall Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsLeft}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Kill Avg:</Text>
              <Text style={styles.statValue}>{activeGame.stats.killAvg}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Death Avg:</Text>
              <Text style={styles.statValue}>{activeGame.stats.deathAvg}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Assist Avg:</Text>
              <Text style={styles.statValue}>{activeGame.stats.assistAvg}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{activeGame.stats.secondaryMetricLabel}:</Text>
              <Text style={styles.statValue}>{activeGame.stats.secondaryMetricValue}</Text>
            </View>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.statsRight}>
            <Text style={styles.overallStatsTitle}>OVERALL STATS</Text>
            <View style={styles.statHighlightBadge}>
              <Text style={styles.statHighlightValue}>{activeGame.stats.winRate}</Text>
              <Text style={styles.statHighlightLabel}>WIN RATE</Text>
            </View>
            <View style={styles.subStatsRow}>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatNum}>{activeGame.stats.totalMatches}</Text>
                <Text style={styles.miniStatLabel}>Matches</Text>
              </View>
              <View style={styles.miniStat}>
                <Text style={styles.miniStatNum}>{activeGame.stats.mvpCount}</Text>
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
              <Ionicons name="people" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <Text style={styles.actionButtonText}>Find a team</Text>
            <Ionicons name="arrow-forward" size={16} color={ClutchTheme.colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/find-coach')}
            activeOpacity={0.8}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="school" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <Text style={styles.actionButtonText}>Find a coach</Text>
            <Ionicons name="arrow-forward" size={16} color={ClutchTheme.colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/my-team')}
            activeOpacity={0.8}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="shield-checkmark" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <Text style={styles.actionButtonText}>My team</Text>
            <Ionicons name="arrow-forward" size={16} color={ClutchTheme.colors.primaryDark} />
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  linkedAccountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    marginBottom: 14,
    ...ClutchTheme.shadows.subtle,
  },
  linkedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ClutchTheme.colors.success,
  },
  linkedTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  linkedTag: {
    color: ClutchTheme.colors.primaryDark,
  },
  linkedSubtitle: {
    fontSize: 10,
    color: ClutchTheme.colors.textMuted,
    fontWeight: '600',
    marginTop: 1,
  },
  switchGameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  switchGameText: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  gameBanner: {
    backgroundColor: ClutchTheme.colors.card,
    borderRadius: ClutchTheme.radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorderLight,
    ...ClutchTheme.shadows.subtle,
  },
  gameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  gameBadgeDot: {
    color: ClutchTheme.colors.success,
    fontSize: 12,
  },
  gameBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 1,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  gameSubtitle: {
    fontSize: 13,
    color: ClutchTheme.colors.textSecondary,
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
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 1,
  },
  sectionBadge: {
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ClutchTheme.colors.primaryDark,
  },
  matchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  matchCard: {
    width: '48.5%',
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    ...ClutchTheme.shadows.retro,
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
    color: ClutchTheme.colors.text,
    flex: 1,
  },
  mvpBadge: {
    backgroundColor: ClutchTheme.colors.gold,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  mvpText: {
    color: ClutchTheme.colors.white,
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
  defeatBadge: {
    backgroundColor: '#FEE2E2',
  },
  resultText: {
    color: ClutchTheme.colors.success,
    fontSize: 11,
    fontWeight: '800',
  },
  defeatText: {
    color: ClutchTheme.colors.danger,
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
    color: ClutchTheme.colors.text,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    color: ClutchTheme.colors.textMuted,
  },
  extraStatText: {
    fontSize: 10,
    fontWeight: '700',
    color: ClutchTheme.colors.primaryDark,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    marginBottom: 24,
    ...ClutchTheme.shadows.retro,
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
    color: ClutchTheme.colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  statsDivider: {
    width: 1.5,
    backgroundColor: ClutchTheme.colors.cardBorderLight,
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
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 6,
  },
  statHighlightBadge: {
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    borderRadius: ClutchTheme.radius.md,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  statHighlightValue: {
    fontSize: 22,
    fontWeight: '900',
    color: ClutchTheme.colors.primaryDark,
  },
  statHighlightLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
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
    color: ClutchTheme.colors.text,
  },
  miniStatLabel: {
    fontSize: 10,
    color: ClutchTheme.colors.textMuted,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClutchTheme.colors.white,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    borderRadius: ClutchTheme.radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...ClutchTheme.shadows.retro,
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ClutchTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
    letterSpacing: 0.5,
  },
});

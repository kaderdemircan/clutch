import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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

interface TeamItem {
  id: string;
  name: string;
  game: string;
  members: string;
  essentialRole: string;
  rating: number;
  description: string;
  tag: string;
}

const TEAMS_DATA: TeamItem[] = [
  {
    id: '1',
    name: 'TEAM PHOENIX',
    game: 'MLBB',
    members: '4/5',
    essentialRole: 'Roamer',
    rating: 5,
    description: 'Looking for an aggressive and communicative Roamer for upcoming tournaments.',
    tag: 'Competitive',
  },
  {
    id: '2',
    name: 'VANGUARD ELITE',
    game: 'MLBB',
    members: '3/5',
    essentialRole: 'Jungler, Mid',
    rating: 5,
    description: 'Mythic Glory squad practicing daily at 20:00. High win-rate required.',
    tag: 'Semi-Pro',
  },
  {
    id: '3',
    name: 'NIGHT WATCHERS',
    game: 'MLBB',
    members: '4/5',
    essentialRole: 'EXP Lane',
    rating: 4,
    description: 'Chill but focused team aiming for seasonal championship.',
    tag: 'Tournament',
  },
  {
    id: '4',
    name: 'SOLAR ECLIPSE',
    game: 'MLBB',
    members: '2/5',
    essentialRole: 'Gold Lane, Roamer',
    rating: 5,
    description: 'Forming new squad for ESL Open and community cups.',
    tag: 'New Squad',
  },
];

const FILTER_CATEGORIES = [
  { id: 'game', label: 'Game: MLBB' },
  { id: 'rank', label: 'Rank: Mythic' },
  { id: 'role', label: 'Role: All' },
  { id: 'age', label: 'Age: 18+' },
];

export default function TeamsScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('game');

  const filteredTeams = TEAMS_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.essentialRole.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoinTeam = (team: TeamItem) => {
    Alert.alert(
      'Apply to Team',
      `Would you like to send an application to join "${team.name}" as ${team.essentialRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () =>
            Alert.alert('Application Sent!', `Your application was sent to ${team.name}.`),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <DestinyHeader
        title="FIND A TEAM"
        showSearch={true}
        searchPlaceholder="Search team name or role..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Filter Row */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filters</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {FILTER_CATEGORIES.map((filter) => {
            const isSelected = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter.id)}
                activeOpacity={0.7}>
                <Text
                  style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {filter.label}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={
                    isSelected ? DestinyTheme.colors.white : DestinyTheme.colors.primaryDark
                  }
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.recommendedTitle}>Recommended Teams ({filteredTeams.length})</Text>
          <TouchableOpacity onPress={() => router.push('/my-team')}>
            <Text style={styles.myTeamLink}>My Team →</Text>
          </TouchableOpacity>
        </View>

        {filteredTeams.map((team) => (
          <View key={team.id} style={styles.teamCard}>
            <View style={styles.cardHeader}>
              <View style={styles.teamAvatar}>
                <Ionicons name="shield" size={24} color={DestinyTheme.colors.primaryDark} />
              </View>
              <View style={styles.teamTitleBox}>
                <Text style={styles.teamName}>{team.name}</Text>
                <View style={styles.ratingRow}>
                  {Array.from({ length: team.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color={DestinyTheme.colors.gold} />
                  ))}
                  <Text style={styles.tagText}>• {team.tag}</Text>
                </View>
              </View>
              <View style={styles.membersBadge}>
                <Ionicons name="people" size={12} color={DestinyTheme.colors.primaryDark} />
                <Text style={styles.membersText}>{team.members}</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Game:</Text>
                <Text style={styles.infoValue}>{team.game}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Essential Role:</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{team.essentialRole}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.descriptionText} numberOfLines={2}>
              {team.description}
            </Text>

            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinTeam(team)}
                activeOpacity={0.8}>
                <Text style={styles.joinButtonText}>Apply to Team</Text>
                <Ionicons name="arrow-forward" size={15} color={DestinyTheme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DestinyTheme.colors.background,
  },
  filterSection: {
    backgroundColor: DestinyTheme.colors.card,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: DestinyTheme.colors.cardBorderLight,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    gap: 6,
    ...DestinyTheme.shadows.subtle,
  },
  filterChipActive: {
    backgroundColor: DestinyTheme.colors.primaryDark,
    borderColor: DestinyTheme.colors.primaryDark,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: DestinyTheme.colors.text,
  },
  filterChipTextActive: {
    color: DestinyTheme.colors.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  myTeamLink: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  teamCard: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    marginBottom: 16,
    ...DestinyTheme.shadows.retro,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teamTitleBox: {
    flex: 1,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  tagText: {
    fontSize: 11,
    color: DestinyTheme.colors.textMuted,
    fontWeight: '600',
    marginLeft: 4,
  },
  membersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DestinyTheme.radius.pill,
    gap: 4,
  },
  membersText: {
    fontSize: 12,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  infoBox: {
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderRadius: DestinyTheme.radius.md,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: DestinyTheme.colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  roleBadge: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  descriptionText: {
    fontSize: 13,
    color: DestinyTheme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.primaryDark,
    borderRadius: DestinyTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 6,
    ...DestinyTheme.shadows.subtle,
  },
  joinButtonText: {
    color: DestinyTheme.colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});

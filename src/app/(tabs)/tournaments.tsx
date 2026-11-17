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

import { ClutchHeader } from '@/components/clutch/header';
import { ClutchTheme } from '@/constants/theme';

interface TournamentItem {
  id: string;
  title: string;
  game: string;
  owner: string;
  fee: string;
  prize: string;
  rating: number;
  slots: string;
  startDate: string;
}

const TOURNAMENTS_DATA: TournamentItem[] = [
  {
    id: '1',
    title: 'MLBB Championship S5',
    game: 'Mobile Legends',
    owner: 'Clutch Esports',
    fee: 'Free',
    prize: '$1,500 + Trophy',
    rating: 5,
    slots: '14/16 Teams',
    startDate: 'This Weekend • 19:00',
  },
  {
    id: '2',
    title: 'Community Brawl Clash',
    game: 'Mobile Legends',
    owner: 'ProArena Global',
    fee: 'Free',
    prize: '5,000 Diamonds',
    rating: 5,
    slots: '28/32 Teams',
    startDate: 'Tomorrow • 20:30',
  },
  {
    id: '3',
    title: 'Mythic All-Stars Invitational',
    game: 'Mobile Legends',
    owner: 'Apex League',
    fee: 'Free',
    prize: '$3,000 Cash Pool',
    rating: 5,
    slots: '8/8 (Waitlist)',
    startDate: 'Next Friday',
  },
];

const FILTER_CATEGORIES = [
  { id: 'game', label: 'Game: MLBB' },
  { id: 'rank', label: 'Rank: Mythic+' },
  { id: 'fee', label: 'Entry: Free' },
  { id: 'region', label: 'Region: Global' },
];

export default function TournamentsScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('game');

  const filteredTournaments = TOURNAMENTS_DATA.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoinTournament = (t: TournamentItem) => {
    Alert.alert(
      'Register Team',
      `Would you like to register your team for "${t.title}"?\n\nEntry Fee: ${t.fee}\nPrize: ${t.prize}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Register',
          onPress: () =>
            Alert.alert(
              'Registration Successful!',
              `Your squad has been enrolled in ${t.title}. Check the Notifications tab for check-in alerts.`
            ),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ClutchHeader
        title="TOURNAMENTS"
        showSearch={true}
        searchPlaceholder="Search tournaments..."
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
                    isSelected ? ClutchTheme.colors.white : ClutchTheme.colors.primaryDark
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
        <Text style={styles.recommendedTitle}>
          Recommended Tournaments ({filteredTournaments.length})
        </Text>

        {filteredTournaments.map((item) => (
          <View key={item.id} style={styles.tourneyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.trophyAvatar}>
                <Ionicons name="trophy" size={24} color={ClutchTheme.colors.gold} />
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.tourneyTitle}>{item.title}</Text>
                <View style={styles.ratingRow}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={13} color={ClutchTheme.colors.gold} />
                  ))}
                  <Text style={styles.ownerText}>• Organized by {item.owner}</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Game</Text>
                <Text style={styles.detailValue}>{item.game}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Entry Fee</Text>
                <Text style={[styles.detailValue, { color: ClutchTheme.colors.success }]}>
                  {item.fee}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Prize Pool</Text>
                <Text style={[styles.detailValue, { color: ClutchTheme.colors.primaryDark }]}>
                  {item.prize}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Slots Filled</Text>
                <Text style={styles.detailValue}>{item.slots}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.dateBox}>
                <Ionicons name="calendar-outline" size={14} color={ClutchTheme.colors.textMuted} />
                <Text style={styles.dateText}>{item.startDate}</Text>
              </View>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinTournament(item)}
                activeOpacity={0.8}>
                <Text style={styles.joinButtonText}>Join →</Text>
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
    backgroundColor: ClutchTheme.colors.background,
  },
  filterSection: {
    backgroundColor: ClutchTheme.colors.card,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ClutchTheme.colors.cardBorderLight,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
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
    backgroundColor: ClutchTheme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    gap: 6,
    ...ClutchTheme.shadows.subtle,
  },
  filterChipActive: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderColor: ClutchTheme.colors.primaryDark,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: ClutchTheme.colors.text,
  },
  filterChipTextActive: {
    color: ClutchTheme.colors.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
    marginBottom: 14,
  },
  tourneyCard: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    marginBottom: 16,
    ...ClutchTheme.shadows.retro,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  trophyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleBox: {
    flex: 1,
  },
  tourneyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 3,
  },
  ownerText: {
    fontSize: 11,
    color: ClutchTheme.colors.textMuted,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderRadius: ClutchTheme.radius.md,
    padding: 12,
    gap: 12,
    marginBottom: 14,
  },
  detailItem: {
    width: '46%',
  },
  detailLabel: {
    fontSize: 11,
    color: ClutchTheme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: ClutchTheme.colors.textSecondary,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderRadius: ClutchTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 22,
    ...ClutchTheme.shadows.subtle,
  },
  joinButtonText: {
    color: ClutchTheme.colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});

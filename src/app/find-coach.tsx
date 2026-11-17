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

interface CoachItem {
  id: string;
  name: string;
  game: string;
  experience: string;
  fee: string;
  rating: number;
  specialty: string;
  description: string;
}

const COACHES_DATA: CoachItem[] = [
  {
    id: '1',
    name: 'Coach Ayşe',
    game: 'MLBB',
    experience: '4 years',
    fee: 'Free (First session)',
    rating: 5,
    specialty: 'Macro & Rotation • EXP Lane Focus',
    description: 'Former pro team analyst. Helps players reach Mythic Immortal with replay review.',
  },
  {
    id: '2',
    name: 'Coach Kerem',
    game: 'MLBB',
    experience: '6 years',
    fee: '150₺ / session',
    rating: 5,
    specialty: 'Jungler Retribution & Fast Farming',
    description: 'Specializes in jungle paths, objective control and teamfight shotcalling.',
  },
  {
    id: '3',
    name: 'Coach Eren',
    game: 'MLBB',
    experience: '5 years',
    fee: 'Free',
    rating: 5,
    specialty: 'Draft Pick & Hero Counters',
    description: 'Prepares amateur teams for upcoming tournaments with drafting tactics.',
  },
];

const FILTER_CATEGORIES = [
  { id: 'game', label: 'Game: MLBB' },
  { id: 'rank', label: 'Rank: Mythic' },
  { id: 'fee', label: 'Fee: Free' },
  { id: 'exp', label: 'Exp: 3+ yrs' },
];

export default function FindCoachScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('game');

  const filteredCoaches = COACHES_DATA.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleInviteCoach = (coach: CoachItem) => {
    Alert.alert(
      'Book Coach',
      `Would you like to send a coaching session request to ${coach.name}?\n\nFee: ${coach.fee}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () =>
            Alert.alert(
              'Request Sent!',
              `Your coaching invitation has been sent to ${coach.name}. You will be notified once accepted.`
            ),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <DestinyHeader
        title="FIND A COACH"
        showBack={true}
        showSearch={true}
        searchPlaceholder="Search coach name or specialty..."
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
        <Text style={styles.recommendedTitle}>
          Recommended Coaches ({filteredCoaches.length})
        </Text>

        {filteredCoaches.map((coach) => (
          <View key={coach.id} style={styles.coachCard}>
            <View style={styles.cardHeader}>
              <View style={styles.coachAvatar}>
                <Ionicons name="school" size={24} color={DestinyTheme.colors.primaryDark} />
              </View>
              <View style={styles.titleBox}>
                <Text style={styles.coachName}>{coach.name}</Text>
                <View style={styles.ratingRow}>
                  {Array.from({ length: coach.rating }).map((_, i) => (
                    <Ionicons key={i} name="star" size={13} color={DestinyTheme.colors.gold} />
                  ))}
                  <Text style={styles.gameTag}>• {coach.game}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience:</Text>
                <Text style={styles.infoValue}>{coach.experience}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Session Fee:</Text>
                <Text style={[styles.infoValue, { color: DestinyTheme.colors.primaryDark }]}>
                  {coach.fee}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Focus:</Text>
                <Text style={styles.infoValue}>{coach.specialty}</Text>
              </View>
            </View>

            <Text style={styles.descriptionText}>{coach.description}</Text>

            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => handleInviteCoach(coach)}
                activeOpacity={0.8}>
                <Text style={styles.inviteButtonText}>Invite →</Text>
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
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
    marginBottom: 14,
  },
  coachCard: {
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
  coachAvatar: {
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
  titleBox: {
    flex: 1,
  },
  coachName: {
    fontSize: 17,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  gameTag: {
    fontSize: 11,
    color: DestinyTheme.colors.textMuted,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoBox: {
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderRadius: DestinyTheme.radius.md,
    padding: 12,
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
  inviteButton: {
    backgroundColor: DestinyTheme.colors.primaryDark,
    borderRadius: DestinyTheme.radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 22,
    ...DestinyTheme.shadows.subtle,
  },
  inviteButtonText: {
    color: DestinyTheme.colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
});

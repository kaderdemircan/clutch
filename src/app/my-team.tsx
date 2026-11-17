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

interface MemberItem {
  id: string;
  name: string;
  role: string;
  rank: string;
  isCaptain?: boolean;
  isCoach?: boolean;
}

const ROSTER: MemberItem[] = [
  { id: '1', name: 'You (Kader)', role: 'EXP Lane', rank: 'Mythic Immortal', isCaptain: true },
  { id: '2', name: 'ShadowBlade', role: 'Jungler', rank: 'Mythic Glory' },
  { id: '3', name: 'Astraea', role: 'Mid Lane', rank: 'Mythic Glory' },
  { id: '4', name: 'Solaris', role: 'Gold Lane', rank: 'Mythic Immortal' },
  { id: '5', name: 'TitanGaurd', role: 'Roamer', rank: 'Mythic' },
  { id: '6', name: 'Coach Ayşe', role: 'Head Coach', rank: 'Master Analyst', isCoach: true },
];

export default function MyTeamScreen() {
  const handleLeaveTeam = () => {
    Alert.alert(
      'Leave Team',
      'Are you sure you want to leave TEAM PHOENIX? You will lose access to team scrims and tournament registrations.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave Team',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Left Team', 'You have left the team.');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <DestinyHeader
        title="MY TEAM"
        showBack={true}
        showSearch={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Team Banner */}
        <View style={styles.teamBanner}>
          <View style={styles.teamLogoCircle}>
            <Ionicons name="shield" size={36} color={DestinyTheme.colors.primaryDark} />
          </View>
          <Text style={styles.teamBannerTitle}>TEAM PHOENIX</Text>
          <Text style={styles.teamBannerSubtitle}>MLBB Competitive Squad • TR Division</Text>
          <View style={styles.teamStatsRow}>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeText}>6/6 Roster Full</Text>
            </View>
            <View style={[styles.teamBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.teamBadgeText, { color: DestinyTheme.colors.success }]}>
                Rank #4 Regional
              </Text>
            </View>
          </View>
        </View>

        {/* Roster Title */}
        <Text style={styles.rosterSectionTitle}>TEAM ROSTER (6)</Text>

        {/* Member Cards */}
        <View style={styles.rosterContainer}>
          {ROSTER.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={[styles.memberAvatar, member.isCoach && styles.coachAvatar]}>
                <Ionicons
                  name={member.isCoach ? 'school' : 'person'}
                  size={20}
                  color={
                    member.isCoach ? DestinyTheme.colors.gold : DestinyTheme.colors.primaryDark
                  }
                />
              </View>

              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  {member.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Text style={styles.captainBadgeText}>CAPTAIN</Text>
                    </View>
                  )}
                  {member.isCoach && (
                    <View style={styles.coachBadge}>
                      <Text style={styles.coachBadgeText}>COACH</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberRole}>
                  Role: <Text style={styles.memberRoleBold}>{member.role}</Text> • {member.rank}
                </Text>
              </View>

              <View style={styles.onlineDot} />
            </View>
          ))}
        </View>

        {/* Action Button: Leave Team */}
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={handleLeaveTeam}
          activeOpacity={0.8}>
          <Text style={styles.leaveButtonText}>Leave from team →</Text>
        </TouchableOpacity>
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
  teamBanner: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    marginBottom: 20,
    ...DestinyTheme.shadows.retro,
  },
  teamLogoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: DestinyTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...DestinyTheme.shadows.subtle,
  },
  teamBannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: DestinyTheme.colors.text,
    letterSpacing: 1,
  },
  teamBannerSubtitle: {
    fontSize: 13,
    color: DestinyTheme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  teamStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  teamBadge: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorderLight,
  },
  teamBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  rosterSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 12,
  },
  rosterContainer: {
    gap: 10,
    marginBottom: 24,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    ...DestinyTheme.shadows.subtle,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachAvatar: {
    backgroundColor: '#FFF8E1',
    borderColor: DestinyTheme.colors.gold,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  captainBadge: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorder,
  },
  captainBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: DestinyTheme.colors.primaryDark,
  },
  coachBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.gold,
  },
  coachBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: DestinyTheme.colors.gold,
  },
  memberRole: {
    fontSize: 12,
    color: DestinyTheme.colors.textSecondary,
    fontWeight: '500',
  },
  memberRoleBold: {
    fontWeight: '700',
    color: DestinyTheme.colors.text,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DestinyTheme.colors.success,
  },
  leaveButton: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    paddingVertical: 14,
    alignItems: 'center',
    ...DestinyTheme.shadows.retro,
  },
  leaveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 0.5,
  },
});

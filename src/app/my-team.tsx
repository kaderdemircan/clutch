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
  { id: '5', name: 'TitanGuard', role: 'Roamer', rank: 'Mythic' },
  { id: '6', name: 'Coach Sarah', role: 'Head Coach', rank: 'Master Analyst', isCoach: true },
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
      <ClutchHeader
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
            <Ionicons name="shield" size={36} color={ClutchTheme.colors.primaryDark} />
          </View>
          <Text style={styles.teamBannerTitle}>TEAM PHOENIX</Text>
          <Text style={styles.teamBannerSubtitle}>MLBB Competitive Squad • Global Division</Text>
          <View style={styles.teamStatsRow}>
            <View style={styles.teamBadge}>
              <Text style={styles.teamBadgeText}>6/6 Roster Full</Text>
            </View>
            <View style={[styles.teamBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.teamBadgeText, { color: ClutchTheme.colors.success }]}>
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
                    member.isCoach ? ClutchTheme.colors.gold : ClutchTheme.colors.primaryDark
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
    backgroundColor: ClutchTheme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  teamBanner: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    marginBottom: 20,
    ...ClutchTheme.shadows.retro,
  },
  teamLogoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...ClutchTheme.shadows.subtle,
  },
  teamBannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: ClutchTheme.colors.text,
    letterSpacing: 1,
  },
  teamBannerSubtitle: {
    fontSize: 13,
    color: ClutchTheme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  teamStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  teamBadge: {
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  teamBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  rosterSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
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
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    ...ClutchTheme.shadows.subtle,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachAvatar: {
    backgroundColor: '#FFF8E1',
    borderColor: ClutchTheme.colors.gold,
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
    color: ClutchTheme.colors.text,
  },
  captainBadge: {
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorder,
  },
  captainBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: ClutchTheme.colors.primaryDark,
  },
  coachBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.gold,
  },
  coachBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: ClutchTheme.colors.gold,
  },
  memberRole: {
    fontSize: 12,
    color: ClutchTheme.colors.textSecondary,
    fontWeight: '500',
  },
  memberRoleBold: {
    fontWeight: '700',
    color: ClutchTheme.colors.text,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ClutchTheme.colors.success,
  },
  leaveButton: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    paddingVertical: 14,
    alignItems: 'center',
    ...ClutchTheme.shadows.retro,
  },
  leaveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 0.5,
  },
});

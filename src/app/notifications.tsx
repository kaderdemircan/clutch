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

interface NotificationItem {
  id: string;
  category: 'team' | 'coach' | 'invite' | 'other';
  title: string;
  time: string;
  read: boolean;
  icon: string;
}

const NOTIFICATIONS_DATA: NotificationItem[] = [
  {
    id: '1',
    category: 'invite',
    title: 'Ahmet sent you a team invitation for "Apex Champions".',
    time: '10 min ago',
    read: false,
    icon: 'mail-unread',
  },
  {
    id: '2',
    category: 'coach',
    title: 'Coach Ayşe accepted your coaching session request.',
    time: '1 hour ago',
    read: false,
    icon: 'school',
  },
  {
    id: '3',
    category: 'team',
    title: 'Team Phoenix is looking for a Jungler for tonight scrim.',
    time: '3 hours ago',
    read: true,
    icon: 'people',
  },
  {
    id: '4',
    category: 'invite',
    title: 'Your application to "Vanguard Elite" was accepted.',
    time: 'Yesterday',
    read: true,
    icon: 'checkmark-circle',
  },
  {
    id: '5',
    category: 'team',
    title: 'Your team invites you to play tournament qualifier match.',
    time: '2 days ago',
    read: true,
    icon: 'game-controller',
  },
  {
    id: '6',
    category: 'other',
    title: 'Your Destiny player profile has been verified and created.',
    time: '3 days ago',
    read: true,
    icon: 'shield-checkmark',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'team', label: 'Team' },
  { id: 'coach', label: 'Coach' },
  { id: 'invite', label: 'Invite' },
  { id: 'other', label: 'Other' },
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const filtered = notifications.filter(
    (n) => activeTab === 'all' || n.category === activeTab
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  return (
    <View style={styles.container}>
      <DestinyHeader
        title="NOTIFICATIONS"
        showBack={true}
        showSearch={false}
      />

      {/* Filter Chips */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filters</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}>
                <Text
                  style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.allNotifTitle}>All Notifications ({filtered.length})</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notificationsContainer}>
          {filtered.map((item) => (
            <View
              key={item.id}
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}>
              <View
                style={[
                  styles.iconCircle,
                  !item.read && styles.iconCircleUnread,
                ]}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={
                    !item.read ? DestinyTheme.colors.primaryDark : DestinyTheme.colors.textMuted
                  }
                />
              </View>

              <View style={styles.notifContent}>
                <Text
                  style={[styles.notifText, !item.read && styles.notifTextUnread]}>
                  {item.title}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              {!item.read && <View style={styles.unreadDot} />}
            </View>
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
    backgroundColor: DestinyTheme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
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
    marginBottom: 12,
  },
  allNotifTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: DestinyTheme.colors.primaryDark,
  },
  notificationsContainer: {
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    ...DestinyTheme.shadows.subtle,
  },
  notifCardUnread: {
    backgroundColor: DestinyTheme.colors.primaryLight,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircleUnread: {
    backgroundColor: DestinyTheme.colors.white,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    fontSize: 13,
    color: DestinyTheme.colors.textSecondary,
    lineHeight: 18,
    fontWeight: '500',
  },
  notifTextUnread: {
    fontWeight: '700',
    color: DestinyTheme.colors.text,
  },
  timeText: {
    fontSize: 11,
    color: DestinyTheme.colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: DestinyTheme.colors.primaryDark,
    marginLeft: 8,
  },
});

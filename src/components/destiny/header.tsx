import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DestinyTheme } from '@/constants/theme';

interface DestinyHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  unreadCount?: number;
}

export function DestinyHeader({
  title = 'PLAYER NAME',
  showBack = false,
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  unreadCount = 3,
}: DestinyHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={DestinyTheme.colors.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push('/player-info')}
            activeOpacity={0.8}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>K</Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}>
          <View style={styles.bellCircle}>
            <Ionicons name="notifications-outline" size={22} color={DestinyTheme.colors.text} />
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Optional Search Bar */}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={18}
              color={DestinyTheme.colors.primaryDark}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={DestinyTheme.colors.primaryDark}
              value={searchValue}
              onChangeText={onSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchValue ? (
              <TouchableOpacity onPress={() => onSearchChange?.('')}>
                <Ionicons name="close-circle" size={18} color={DestinyTheme.colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: DestinyTheme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: DestinyTheme.colors.cardBorderLight,
    paddingBottom: 12,
    paddingHorizontal: 16,
    ...DestinyTheme.shadows.subtle,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
  },
  avatarButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: DestinyTheme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    ...DestinyTheme.shadows.subtle,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.primaryDark,
    gap: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: DestinyTheme.colors.text,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  bellButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: DestinyTheme.colors.card,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorderLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: DestinyTheme.colors.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.white,
  },
  unreadBadgeText: {
    color: DestinyTheme.colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  searchWrapper: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.primaryDark,
    paddingHorizontal: 16,
    height: 44,
    ...DestinyTheme.shadows.retro,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: DestinyTheme.colors.text,
  },
});

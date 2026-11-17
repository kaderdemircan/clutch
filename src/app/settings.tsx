import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClutchHeader } from '@/components/clutch/header';
import { ClutchTheme } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of CLUTCH?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ClutchHeader
        title="SETTINGS"
        showBack={true}
        showSearch={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          {/* Language */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Language', 'Default app language is English (EN).')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="globe-outline" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDesc}>English (US)</Text>
            </View>
            <View style={styles.langPill}>
              <Text style={styles.langPillText}>EN</Text>
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={ClutchTheme.colors.primaryDark}
              />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDesc}>Match invites, coach answers & alerts</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: '#E0E0E0',
                true: ClutchTheme.colors.primaryDark,
              }}
              thumbColor={ClutchTheme.colors.white}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon-outline" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Night-friendly theme for gaming</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{
                false: '#E0E0E0',
                true: ClutchTheme.colors.primaryDark,
              }}
              thumbColor={ClutchTheme.colors.white}
            />
          </View>

          {/* Privacy */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Privacy', 'Your match records and stats are protected under Clutch Privacy Policy.')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed-outline" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Privacy & Security</Text>
              <Text style={styles.settingDesc}>Profile visibility & squad permissions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ClutchTheme.colors.textMuted} />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Terms of Service', 'Clutch Esports Platform Rules and fair-play guidelines.')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingDesc}>Tournament rules & community conduct</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ClutchTheme.colors.textMuted} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            onPress={() => Alert.alert('Help & Support', 'Contact us via Discord or support ticket at support@clutch.gg.')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="help-circle-outline" size={20} color={ClutchTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDesc}>FAQ, bug reports, and contact team</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={ClutchTheme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Log out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={ClutchTheme.colors.danger} />
          <Text style={styles.logoutButtonText}>Log out →</Text>
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
  settingsCard: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 20,
    ...ClutchTheme.shadows.retro,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ClutchTheme.colors.cardBorderLight,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ClutchTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingTextBox: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  settingDesc: {
    fontSize: 12,
    color: ClutchTheme.colors.textMuted,
    marginTop: 2,
  },
  langPill: {
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorder,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.danger,
    paddingVertical: 14,
    gap: 8,
    ...ClutchTheme.shadows.retro,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.danger,
    letterSpacing: 0.5,
  },
});

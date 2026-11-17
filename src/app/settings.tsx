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

import { DestinyHeader } from '@/components/destiny/header';
import { DestinyTheme } from '@/constants/theme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState<'TR' | 'EN'>('TR');

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of DESTINY?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'TR' ? 'EN' : 'TR'));
    Alert.alert('Language', `Language switched to ${language === 'TR' ? 'English' : 'Türkçe'}`);
  };

  return (
    <View style={styles.container}>
      <DestinyHeader
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
            onPress={handleToggleLanguage}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="globe-outline" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDesc}>
                Current: {language === 'TR' ? 'Türkçe (TR)' : 'English (EN)'}
              </Text>
            </View>
            <View style={styles.langPill}>
              <Text style={styles.langPillText}>{language}</Text>
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={DestinyTheme.colors.primaryDark}
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
                true: DestinyTheme.colors.primaryDark,
              }}
              thumbColor={DestinyTheme.colors.white}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon-outline" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Night friendly theme for gaming</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{
                false: '#E0E0E0',
                true: DestinyTheme.colors.primaryDark,
              }}
              thumbColor={DestinyTheme.colors.white}
            />
          </View>

          {/* Privacy */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Privacy', 'Your match records and stats are protected.')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed-outline" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Privacy</Text>
              <Text style={styles.settingDesc}>Profile visibility & party permissions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={DestinyTheme.colors.textMuted} />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Terms of Service', 'Destiny Esports Platform Rules.')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingDesc}>Fair-play & tournament guidelines</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={DestinyTheme.colors.textMuted} />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={[styles.settingRow, styles.settingRowLast]}
            onPress={() => Alert.alert('Help & Support', 'Reach out via discord or support ticket.')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Ionicons name="help-circle-outline" size={20} color={DestinyTheme.colors.primaryDark} />
            </View>
            <View style={styles.settingTextBox}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDesc}>FAQ, bug reports and contact</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={DestinyTheme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Log out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={DestinyTheme.colors.danger} />
          <Text style={styles.logoutButtonText}>Log out →</Text>
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
  settingsCard: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 20,
    ...DestinyTheme.shadows.retro,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: DestinyTheme.colors.cardBorderLight,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DestinyTheme.colors.primaryLight,
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
    color: DestinyTheme.colors.text,
  },
  settingDesc: {
    fontSize: 12,
    color: DestinyTheme.colors.textMuted,
    marginTop: 2,
  },
  langPill: {
    backgroundColor: DestinyTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorder,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: DestinyTheme.colors.primaryDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.danger,
    paddingVertical: 14,
    gap: 8,
    ...DestinyTheme.shadows.retro,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.danger,
    letterSpacing: 0.5,
  },
});

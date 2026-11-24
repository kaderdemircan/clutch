import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClutchTheme } from '@/constants/theme';
import { SupportedGame, useAuth } from '@/context/auth-context';

interface GameOption {
  id: SupportedGame;
  title: string;
  badge: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  defaultTagPlaceholder: string;
  defaultEmailPlaceholder: string;
  regions: string[];
}

const GAMES: GameOption[] = [
  {
    id: 'mlbb',
    title: 'Mobile Legends: Bang Bang',
    badge: 'MLBB',
    subtitle: 'Moonton ID • Hero Pool • Match History',
    icon: 'shield-half',
    defaultTagPlaceholder: 'e.g. Kader (ID: 84920412)',
    defaultEmailPlaceholder: 'moonton_player@gmail.com',
    regions: ['Global / TR', 'Southeast Asia', 'North America', 'Europe'],
  },
  {
    id: 'lol',
    title: 'League of Legends',
    badge: 'LoL',
    subtitle: 'Riot Games • Ranked Solo/Duo • Champion Stats',
    icon: 'trophy',
    defaultTagPlaceholder: 'e.g. Kader#EUW',
    defaultEmailPlaceholder: 'riot_player@gmail.com',
    regions: ['EU West', 'EU Nordic & East', 'North America', 'Turkey'],
  },
  {
    id: 'valorant',
    title: 'Valorant',
    badge: 'VALO',
    subtitle: 'Riot Vanguard • ACS & Headshot % • Agent Pool',
    icon: 'locate',
    defaultTagPlaceholder: 'e.g. Kader#VAL',
    defaultEmailPlaceholder: 'riot_player@gmail.com',
    regions: ['Frankfurt', 'London', 'Paris', 'Istanbul'],
  },
];

export default function ConnectGameScreen() {
  const insets = useSafeAreaInsets();
  const { user, linkGameAccount } = useAuth();

  // Wizard Steps: 1: Select Game, 2: Credentials, 3: OTP Verification, 4: Syncing Done
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGame, setSelectedGame] = useState<SupportedGame>('mlbb');

  // Form Fields
  const [gameEmail, setGameEmail] = useState('');
  const [gamePassword, setGamePassword] = useState('');
  const [gameTag, setGameTag] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Global / TR');
  const [otpCode, setOtpCode] = useState('');

  // Syncing state
  const [syncStatus, setSyncStatus] = useState<string>('Verifying game credentials...');
  const [syncProgress, setSyncProgress] = useState<number>(0.2);

  const activeGameConfig = GAMES.find((g) => g.id === selectedGame) || GAMES[0];

  const handleSelectGame = (gameId: SupportedGame) => {
    setSelectedGame(gameId);
    const cfg = GAMES.find((g) => g.id === gameId);
    if (cfg) {
      setSelectedRegion(cfg.regions[0]);
    }
    setStep(2);
  };

  const handleSendOtp = () => {
    if (!gameEmail.trim()) {
      setGameEmail(user?.email || activeGameConfig.defaultEmailPlaceholder);
    }
    if (!gameTag.trim()) {
      setGameTag(activeGameConfig.defaultTagPlaceholder.replace('e.g. ', ''));
    }
    setStep(3);
  };

  const handleVerifyAndSync = () => {
    setStep(4);
    setSyncProgress(0.25);
    setSyncStatus('Connecting to game provider server...');

    setTimeout(() => {
      setSyncProgress(0.55);
      setSyncStatus('Fetching recent ranked matches and player metadata...');
    }, 900);

    setTimeout(() => {
      setSyncProgress(0.85);
      setSyncStatus('Analyzing KDA, MVP rate and champion performance...');
    }, 1800);

    setTimeout(() => {
      setSyncProgress(1.0);
      setSyncStatus('5 matches synced successfully!');

      // Link in AuthContext
      linkGameAccount({
        game: selectedGame,
        gameEmail: gameEmail.trim() || user?.email || 'player@clutch.gg',
        gameTag: gameTag.trim() || `${user?.name || 'Player'}#${selectedGame.toUpperCase()}`,
        region: selectedRegion,
      });

      setTimeout(() => {
        router.replace('/(tabs)');
      }, 700);
    }, 2700);
  };

  const handleSkip = () => {
    // Default link to MLBB for testing so the app is always populated
    linkGameAccount({
      game: 'mlbb',
      gameEmail: user?.email || 'player@clutch.gg',
      gameTag: `${user?.name || 'Kader'}#MLBB`,
      region: 'Global / TR',
    });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={[styles.innerContainer, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Top Navigation */}
        <View style={styles.topNav}>
          {step > 1 && step < 4 ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep((prev) => (prev - 1) as any)}
              activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color={ClutchTheme.colors.primaryDark} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <Text style={styles.navTitle}>LINK GAME</Text>

          {step < 4 ? (
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
              <Text style={styles.skipButtonText}>Skip →</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        {/* Step Progress Bar */}
        <View style={styles.progressBarRow}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressSegment,
                step >= s && styles.progressSegmentActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* STEP 1: SELECT GAME */}
          {step === 1 && (
            <View style={styles.stepSection}>
              <View style={styles.headerTextBox}>
                <Text style={styles.stepSubtitle}>STEP 1 OF 3</Text>
                <Text style={styles.stepTitle}>Select Your Primary Game</Text>
                <Text style={styles.stepDescription}>
                  Connect your game account to automatically pull, analyze, and track your last 5 matches.
                </Text>
              </View>

              <View style={styles.gamesList}>
                {GAMES.map((game) => (
                  <TouchableOpacity
                    key={game.id}
                    style={[
                      styles.gameCard,
                      selectedGame === game.id && styles.gameCardSelected,
                    ]}
                    onPress={() => handleSelectGame(game.id)}
                    activeOpacity={0.8}>
                    <View style={styles.gameIconBox}>
                      <Ionicons
                        name={game.icon}
                        size={28}
                        color={ClutchTheme.colors.primaryDark}
                      />
                    </View>

                    <View style={styles.gameInfo}>
                      <View style={styles.gameTitleRow}>
                        <Text style={styles.gameCardTitle}>{game.title}</Text>
                        <View style={styles.gameBadge}>
                          <Text style={styles.gameBadgeText}>{game.badge}</Text>
                        </View>
                      </View>
                      <Text style={styles.gameCardSubtitle}>{game.subtitle}</Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={
                        selectedGame === game.id
                          ? ClutchTheme.colors.primaryDark
                          : ClutchTheme.colors.textMuted
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* STEP 2: CREDENTIALS */}
          {step === 2 && (
            <View style={styles.stepSection}>
              <View style={styles.headerTextBox}>
                <View style={styles.activeGamePill}>
                  <Text style={styles.activeGamePillText}>{activeGameConfig.title}</Text>
                </View>
                <Text style={styles.stepSubtitle}>STEP 2 OF 3</Text>
                <Text style={styles.stepTitle}>Enter Game Account Details</Text>
                <Text style={styles.stepDescription}>
                  Provide the game email and in-game name associated with your {activeGameConfig.badge} account.
                </Text>
              </View>

              <View style={styles.formCard}>
                {/* Game Tag / IGN */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>In-Game Player Tag / IGN</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={ClutchTheme.colors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={activeGameConfig.defaultTagPlaceholder}
                      placeholderTextColor={ClutchTheme.colors.textMuted}
                      value={gameTag}
                      onChangeText={setGameTag}
                    />
                  </View>
                </View>

                {/* Game Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Game Account Email</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={ClutchTheme.colors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder={activeGameConfig.defaultEmailPlaceholder}
                      placeholderTextColor={ClutchTheme.colors.textMuted}
                      value={gameEmail}
                      onChangeText={setGameEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Game Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Game Account Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={ClutchTheme.colors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••••••"
                      placeholderTextColor={ClutchTheme.colors.textMuted}
                      value={gamePassword}
                      onChangeText={setGamePassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Region Selector */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Server / Region</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionsRow}>
                    {activeGameConfig.regions.map((reg) => (
                      <TouchableOpacity
                        key={reg}
                        style={[
                          styles.regionChip,
                          selectedRegion === reg && styles.regionChipActive,
                        ]}
                        onPress={() => setSelectedRegion(reg)}>
                        <Text
                          style={[
                            styles.regionChipText,
                            selectedRegion === reg && styles.regionChipTextActive,
                          ]}>
                          {reg}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Security Note */}
                <View style={styles.securityBox}>
                  <Ionicons name="shield-checkmark" size={16} color={ClutchTheme.colors.success} />
                  <Text style={styles.securityText}>
                    Read-only match query. We will email a 6-digit confirmation code for 2FA ownership verification.
                  </Text>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleSendOtp}
                  activeOpacity={0.8}>
                  <Text style={styles.actionButtonText}>Send Verification Code →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 3 && (
            <View style={styles.stepSection}>
              <View style={styles.headerTextBox}>
                <View style={styles.activeGamePill}>
                  <Text style={styles.activeGamePillText}>{activeGameConfig.badge} Verification</Text>
                </View>
                <Text style={styles.stepSubtitle}>STEP 3 OF 3</Text>
                <Text style={styles.stepTitle}>Enter Verification Code</Text>
                <Text style={styles.stepDescription}>
                  We sent a 6-digit code to{' '}
                  <Text style={styles.boldEmail}>
                    {gameEmail || activeGameConfig.defaultEmailPlaceholder}
                  </Text>
                  . Enter it below to sync your match history.
                </Text>
              </View>

              <View style={styles.formCard}>
                {/* 6 Digit Input */}
                <View style={styles.otpWrapper}>
                  <Text style={styles.inputLabel}>6-Digit Security Code</Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="123456"
                    placeholderTextColor={ClutchTheme.colors.textMuted}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                  <Text style={styles.otpHint}>
                    Tip: Enter any 6 numbers (e.g. 123456) for demo sync.
                  </Text>
                </View>

                {/* Resend Link */}
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={() => Alert.alert('Code Resent', 'A new 6-digit verification code has been dispatched.')}>
                  <Text style={styles.resendText}>Didn&apos;t receive code? Resend Code</Text>
                </TouchableOpacity>

                {/* Action Button */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleVerifyAndSync}
                  activeOpacity={0.8}>
                  <Text style={styles.actionButtonText}>Verify &amp; Sync Matches →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4: SYNCING ANIMATION */}
          {step === 4 && (
            <View style={styles.syncingContainer}>
              <View style={styles.syncCard}>
                <View style={styles.syncIconContainer}>
                  {syncProgress >= 1 ? (
                    <Ionicons name="checkmark-circle" size={64} color={ClutchTheme.colors.success} />
                  ) : (
                    <ActivityIndicator size="large" color={ClutchTheme.colors.primaryDark} />
                  )}
                </View>

                <Text style={styles.syncTitle}>
                  {syncProgress >= 1 ? 'Matches Synced!' : 'Analyzing Matches...'}
                </Text>
                <Text style={styles.syncStatusText}>{syncStatus}</Text>

                {/* Progress bar */}
                <View style={styles.syncProgressBarTrack}>
                  <View style={[styles.syncProgressBarFill, { width: `${syncProgress * 100}%` }]} />
                </View>

                <View style={styles.syncDetailsBox}>
                  <View style={styles.syncDetailItem}>
                    <Text style={styles.syncDetailLabel}>Game:</Text>
                    <Text style={styles.syncDetailValue}>{activeGameConfig.title}</Text>
                  </View>
                  <View style={styles.syncDetailItem}>
                    <Text style={styles.syncDetailLabel}>Account:</Text>
                    <Text style={styles.syncDetailValue}>
                      {gameTag || `${user?.name || 'Player'}#${selectedGame.toUpperCase()}`}
                    </Text>
                  </View>
                  <View style={styles.syncDetailItem}>
                    <Text style={styles.syncDetailLabel}>Matches Retrieved:</Text>
                    <Text style={[styles.syncDetailValue, { color: ClutchTheme.colors.primaryDark }]}>
                      Last 5 Matches
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ClutchTheme.colors.background,
  },
  innerContainer: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: ClutchTheme.colors.text,
    letterSpacing: 1.2,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.textMuted,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  progressBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: ClutchTheme.colors.cardBorderLight,
  },
  progressSegmentActive: {
    backgroundColor: ClutchTheme.colors.primaryDark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepSection: {
    gap: 16,
  },
  headerTextBox: {
    marginBottom: 8,
  },
  activeGamePill: {
    alignSelf: 'flex-start',
    backgroundColor: ClutchTheme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
    marginBottom: 8,
  },
  activeGamePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
  },
  stepSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: ClutchTheme.colors.text,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    color: ClutchTheme.colors.textSecondary,
    lineHeight: 19,
  },
  boldEmail: {
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  gamesList: {
    gap: 14,
    marginTop: 8,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    gap: 14,
    ...ClutchTheme.shadows.retro,
  },
  gameCardSelected: {
    borderColor: ClutchTheme.colors.primaryDark,
    backgroundColor: ClutchTheme.colors.primaryLight,
  },
  gameIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  gameBadge: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gameBadgeText: {
    color: ClutchTheme.colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  gameCardSubtitle: {
    fontSize: 12,
    color: ClutchTheme.colors.textMuted,
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    gap: 16,
    ...ClutchTheme.shadows.retro,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
    borderRadius: ClutchTheme.radius.md,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: ClutchTheme.colors.text,
    fontWeight: '600',
  },
  regionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  regionChip: {
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
  },
  regionChipActive: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderColor: ClutchTheme.colors.primaryDark,
  },
  regionChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: ClutchTheme.colors.textSecondary,
  },
  regionChipTextActive: {
    color: ClutchTheme.colors.white,
  },
  securityBox: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: ClutchTheme.radius.md,
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  securityText: {
    flex: 1,
    fontSize: 11,
    color: '#166534',
    lineHeight: 15,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderRadius: ClutchTheme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    ...ClutchTheme.shadows.subtle,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: ClutchTheme.colors.white,
    letterSpacing: 0.5,
  },
  otpWrapper: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  otpInput: {
    width: '80%',
    height: 56,
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderRadius: ClutchTheme.radius.md,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 10,
    color: ClutchTheme.colors.text,
  },
  otpHint: {
    fontSize: 11,
    color: ClutchTheme.colors.textMuted,
    fontStyle: 'italic',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: ClutchTheme.colors.secondary,
  },
  syncingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  syncCard: {
    width: '100%',
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 28,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    alignItems: 'center',
    gap: 14,
    ...ClutchTheme.shadows.retro,
  },
  syncIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ClutchTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  syncTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: ClutchTheme.colors.text,
  },
  syncStatusText: {
    fontSize: 13,
    color: ClutchTheme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
    minHeight: 36,
  },
  syncProgressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  syncProgressBarFill: {
    height: '100%',
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderRadius: 4,
  },
  syncDetailsBox: {
    width: '100%',
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderRadius: ClutchTheme.radius.md,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  syncDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncDetailLabel: {
    fontSize: 12,
    color: ClutchTheme.colors.textMuted,
    fontWeight: '600',
  },
  syncDetailValue: {
    fontSize: 12,
    color: ClutchTheme.colors.text,
    fontWeight: '800',
  },
});

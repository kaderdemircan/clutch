import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DestinyTheme } from '@/constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = () => {
    if (!email.trim() && !password.trim()) {
      // Allow demo bypass
      router.replace('/(tabs)' as any);
      return;
    }
    Alert.alert('Welcome!', `Logged in successfully as ${email || 'Player'}`);
    router.replace('/(tabs)' as any);
  };

  const handleSocialLogin = (provider: 'Google' | 'Discord') => {
    Alert.alert(
      `${provider} ile Giriş`,
      `${provider} hesabınız ile bağlanılıyor...`,
      [
        {
          text: 'Tamam',
          onPress: () => router.replace('/(tabs)' as any),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      {/* Background Star Ornaments */}
      <View style={[styles.starOrnament, styles.starTopRight]}>
        <Ionicons name="sparkles" size={54} color="rgba(255, 92, 157, 0.25)" />
      </View>
      <View style={[styles.starOrnament, styles.starBottomLeft]}>
        <Ionicons name="sparkles" size={72} color="rgba(255, 92, 157, 0.2)" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="star" size={24} color={DestinyTheme.colors.primaryDark} />
          </View>
          <Text style={styles.brandTitle}>DESTINY</Text>
          <Text style={styles.welcomeSubtitle}>
            {isRegister ? 'Join the arena, player.' : 'Welcome, player.'}
          </Text>
          <Text style={styles.mottoText}>Analyze. Adapt. Dominate.</Text>
        </View>

        {/* Social Auth Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Google')}
            activeOpacity={0.8}>
            <Ionicons name="logo-google" size={18} color="#EA4335" />
            <Text style={styles.socialButtonText}>Google ile devam et</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Discord')}
            activeOpacity={0.8}>
            <Ionicons name="logo-discord" size={18} color="#5865F2" />
            <Text style={styles.socialButtonText}>Discord ile devam et</Text>
          </TouchableOpacity>
        </View>

        {/* Or Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={DestinyTheme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="player@destiny.gg"
                placeholderTextColor={DestinyTheme.colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={DestinyTheme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor={DestinyTheme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {!isRegister && (
            <TouchableOpacity
              style={styles.forgotPassButton}
              onPress={() => Alert.alert('Reset Password', 'Password reset link sent to your email.')}>
              <Text style={styles.forgotPassText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>{isRegister ? 'REGISTER' : 'LOGIN'}</Text>
          </TouchableOpacity>

          {/* Toggle Register */}
          <TouchableOpacity
            style={styles.toggleRegisterButton}
            onPress={() => setIsRegister((prev) => !prev)}>
            <Text style={styles.toggleRegisterText}>
              {isRegister ? (
                <>
                  Already have an account? <Text style={styles.linkBold}>Login</Text>
                </>
              ) : (
                <>
                  Don&apos;t have account? <Text style={styles.linkBold}>Register</Text>
                </>
              )}
            </Text>
          </TouchableOpacity>
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
  starOrnament: {
    position: 'absolute',
    zIndex: 0,
  },
  starTopRight: {
    top: 40,
    right: 20,
  },
  starBottomLeft: {
    bottom: 60,
    left: -10,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    zIndex: 1,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: DestinyTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: DestinyTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...DestinyTheme.shadows.retro,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: DestinyTheme.colors.primaryDark,
    letterSpacing: 2,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DestinyTheme.colors.text,
    marginTop: 4,
  },
  mottoText: {
    fontSize: 13,
    fontWeight: '600',
    color: DestinyTheme.colors.textMuted,
    marginTop: 2,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    paddingVertical: 12,
    gap: 10,
    ...DestinyTheme.shadows.retro,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DestinyTheme.colors.cardBorderLight,
  },
  dividerText: {
    fontSize: 12,
    color: DestinyTheme.colors.textMuted,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: DestinyTheme.colors.white,
    borderRadius: DestinyTheme.radius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: DestinyTheme.colors.cardBorder,
    ...DestinyTheme.shadows.retro,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: DestinyTheme.colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DestinyTheme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: DestinyTheme.colors.cardBorderLight,
    borderRadius: DestinyTheme.radius.md,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: DestinyTheme.colors.text,
    fontWeight: '600',
  },
  forgotPassButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  forgotPassText: {
    fontSize: 13,
    fontWeight: '700',
    color: DestinyTheme.colors.secondary,
  },
  loginButton: {
    backgroundColor: DestinyTheme.colors.primaryDark,
    borderRadius: DestinyTheme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    ...DestinyTheme.shadows.subtle,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: DestinyTheme.colors.white,
    letterSpacing: 1,
  },
  toggleRegisterButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleRegisterText: {
    fontSize: 13,
    color: DestinyTheme.colors.textSecondary,
    fontWeight: '500',
  },
  linkBold: {
    fontWeight: '800',
    color: DestinyTheme.colors.secondary,
  },
});

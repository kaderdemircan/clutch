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
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate email format
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  const handleAuth = async () => {
    const trimmedEmail = email.trim();

    // 1. Validation checks
    if (!trimmedEmail) {
      Alert.alert('Email Required', 'Please enter your email address to continue.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address (e.g. player@clutch.gg).'
      );
      return;
    }

    if (!password) {
      Alert.alert('Password Required', 'Please enter your password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Password Too Short',
        'Your password must be at least 6 characters long.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        // Registration flow
        const { error, needsEmailConfirmation } = await signUp(
          trimmedEmail,
          password,
          username.trim() || undefined
        );

        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('already registered') || msg.includes('user already exists')) {
            Alert.alert(
              'Account Exists',
              'An account with this email already exists. Please switch to Login.'
            );
          } else if (msg.includes('weak') || msg.includes('password')) {
            Alert.alert('Weak Password', error.message);
          } else {
            Alert.alert('Registration Failed', error.message);
          }
          return;
        }

        if (needsEmailConfirmation) {
          Alert.alert(
            'Check Your Inbox',
            `A confirmation email was sent to ${trimmedEmail}. Please verify your email before logging in.`,
            [
              {
                text: 'Go to Login',
                onPress: () => {
                  setIsRegister(false);
                  setPassword('');
                },
              },
            ]
          );
        } else {
          // Immediately logged in
          router.replace('/connect-game' as any);
        }
      } else {
        // Sign-in flow
        const { error } = await signIn(trimmedEmail, password);

        if (error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
            Alert.alert(
              'Authentication Failed',
              'Invalid email or password. Please check your credentials and try again.'
            );
          } else if (msg.includes('email not confirmed')) {
            Alert.alert(
              'Email Not Confirmed',
              'Please check your email and click the confirmation link before logging in.'
            );
          } else {
            Alert.alert('Login Error', error.message);
          }
          return;
        }

        // Successfully authenticated
        router.replace('/connect-game' as any);
      }
    } catch (err: any) {
      Alert.alert(
        'Network Error',
        err?.message || 'Unable to connect to the authentication server. Please check your network.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert(
        'Email Required',
        'Please enter your account email in the Email field above, then tap "Forgot password?".'
      );
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await resetPassword(trimmedEmail);
      if (error) {
        Alert.alert('Reset Failed', error.message);
      } else {
        Alert.alert(
          'Password Reset Sent',
          `If an account exists for ${trimmedEmail}, a password reset link has been dispatched to your email.`
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not send reset password email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: 'Google' | 'Discord') => {
    Alert.alert(
      `${provider} Sign-In Not Configured`,
      `${provider} OAuth is not enabled in your Supabase backend yet.\n\nTo enable it, navigate to your Supabase Dashboard -> Authentication -> Providers, and configure your ${provider} Client ID and Secret.`
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={[styles.innerContainer, { paddingTop: insets.top + 20 }]}>
        {/* Background Star Ornaments */}
        <View style={[styles.starOrnament, styles.starTopRight]}>
          <Ionicons name="sparkles" size={54} color="rgba(255, 92, 157, 0.25)" />
        </View>
        <View style={[styles.starOrnament, styles.starBottomLeft]}>
          <Ionicons name="sparkles" size={72} color="rgba(255, 92, 157, 0.2)" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="star" size={24} color={ClutchTheme.colors.primaryDark} />
            </View>
            <Text style={styles.brandTitle}>CLUTCH</Text>
            <Text style={styles.welcomeSubtitle}>
              {isRegister ? 'Join the squad, player.' : 'Welcome, player.'}
            </Text>
            <Text style={styles.mottoText}>Analyze. Adapt. Dominate.</Text>
          </View>

          {/* Social Auth Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Google')}
              activeOpacity={0.8}
              disabled={isSubmitting}>
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Discord')}
              activeOpacity={0.8}
              disabled={isSubmitting}>
              <Ionicons name="logo-discord" size={18} color="#5865F2" />
              <Text style={styles.socialButtonText}>Continue with Discord</Text>
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
            {/* Optional Player Username (Only in Register mode) */}
            {isRegister && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Player Tag / Username (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={ClutchTheme.colors.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. NeonClutch"
                    placeholderTextColor={ClutchTheme.colors.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={ClutchTheme.colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="player@clutch.gg"
                  placeholderTextColor={ClutchTheme.colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={ClutchTheme.colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={ClutchTheme.colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* Forgot password */}
            {!isRegister && (
              <TouchableOpacity
                style={styles.forgotPassButton}
                onPress={handleForgotPassword}
                disabled={isSubmitting}
                activeOpacity={0.7}>
                <Text style={styles.forgotPassText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.loginButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleAuth}
              activeOpacity={0.8}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color={ClutchTheme.colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>
                  {isRegister ? 'CREATE ACCOUNT' : 'LOGIN'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Register / Login */}
            <TouchableOpacity
              style={styles.toggleRegisterButton}
              onPress={() => {
                setIsRegister((prev) => !prev);
              }}
              disabled={isSubmitting}
              activeOpacity={0.7}>
              <Text style={styles.toggleRegisterText}>
                {isRegister ? (
                  <>
                    Already have an account? <Text style={styles.linkBold}>Login</Text>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account? <Text style={styles.linkBold}>Register</Text>
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: ClutchTheme.colors.primaryLight,
    borderWidth: 2,
    borderColor: ClutchTheme.colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...ClutchTheme.shadows.retro,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: ClutchTheme.colors.primaryDark,
    letterSpacing: 2,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ClutchTheme.colors.text,
    marginTop: 4,
  },
  mottoText: {
    fontSize: 13,
    fontWeight: '600',
    color: ClutchTheme.colors.textMuted,
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
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.pill,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    paddingVertical: 12,
    gap: 10,
    ...ClutchTheme.shadows.retro,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
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
    backgroundColor: ClutchTheme.colors.cardBorderLight,
  },
  dividerText: {
    fontSize: 12,
    color: ClutchTheme.colors.textMuted,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: ClutchTheme.colors.white,
    borderRadius: ClutchTheme.radius.xl,
    padding: 20,
    borderWidth: 1.5,
    borderColor: ClutchTheme.colors.cardBorder,
    ...ClutchTheme.shadows.retro,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: ClutchTheme.colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ClutchTheme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: ClutchTheme.colors.cardBorderLight,
    borderRadius: ClutchTheme.radius.md,
    paddingHorizontal: 12,
    height: 46,
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
  forgotPassButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  forgotPassText: {
    fontSize: 13,
    fontWeight: '700',
    color: ClutchTheme.colors.secondary,
  },
  loginButton: {
    backgroundColor: ClutchTheme.colors.primaryDark,
    borderRadius: ClutchTheme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...ClutchTheme.shadows.subtle,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: ClutchTheme.colors.white,
    letterSpacing: 1,
  },
  toggleRegisterButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleRegisterText: {
    fontSize: 13,
    color: ClutchTheme.colors.textSecondary,
    fontWeight: '500',
  },
  linkBold: {
    fontWeight: '800',
    color: ClutchTheme.colors.secondary,
  },
});

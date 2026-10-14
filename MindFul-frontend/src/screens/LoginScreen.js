import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setErrorMessage('');
    if (!validateForm()) return;

    const result = await login(email.trim(), password);
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your details.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Account Assistance',
      'If you have registered an account, password assistance instructions will be sent to your email address.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textMain} />
            </TouchableOpacity>
            <View style={styles.sanctuaryBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
              <Text style={styles.sanctuaryBadgeText}>Secure Portal</Text>
            </View>
          </View>

          {/* Brand Header */}
          <View style={styles.headerSection}>
            <View style={styles.glowAura} />
            <View style={styles.emblemContainer}>
              <View style={styles.emblemInner}>
                <Ionicons name="leaf" size={28} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Take a gentle breath and return to your emotional sanctuary.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {email.length > 0 && (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.submitBtnText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
                </View>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Quick Guest Exploration Button */}
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                });
              }}
            >
              <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
              <Text style={styles.guestBtnText}>Explore Sanctuary as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Switcher */}
          <View style={styles.switchSection}>
            <Text style={styles.switchPrompt}>New to Mindful?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.switchAction}> Create Sanctuary Account</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Guarantee */}
          <View style={styles.privacyNote}>
            <Ionicons name="lock-closed" size={13} color={colors.textMuted} />
            <Text style={styles.privacyNoteText}>
              Zero-knowledge architecture. Your emotional data is encrypted.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sanctuaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c8ead9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 4,
  },
  sanctuaryBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: '#1d3e2b',
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    top: -10,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(200, 234, 217, 0.45)',
  },
  emblemContainer: {
    padding: 6,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: spacing.sm,
  },
  emblemInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineLg,
    color: colors.textMain,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginTop: spacing.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorContainer,
    borderRadius: radius.md,
    padding: 10,
    marginBottom: spacing.md,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.onErrorContainer,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inputLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  forgotText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceBase,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.25)',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textInverse,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(122, 154, 139, 0.15)',
  },
  dividerText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginHorizontal: 12,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3FF',
    height: 46,
    borderRadius: radius.lg,
    gap: 8,
  },
  guestBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMain,
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  switchPrompt: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
  },
  switchAction: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodySm,
    color: colors.primary,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: 6,
  },
  privacyNoteText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

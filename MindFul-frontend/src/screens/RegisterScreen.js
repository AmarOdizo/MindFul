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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage('Please enter your name or preferred moniker');
      return false;
    }
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
      setErrorMessage('Please enter a secure password');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setErrorMessage('Please accept the sanctuary guidelines to proceed');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setErrorMessage('');
    if (!validateForm()) return;

    const result = await register(name.trim(), email.trim(), password);
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
    }
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
          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={22} color={colors.textMain} />
            </TouchableOpacity>
            <View style={styles.badgePill}>
              <Ionicons name="sparkles" size={13} color="#685878" />
              <Text style={styles.badgePillText}>Begin Journey</Text>
            </View>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.glowAura} />
            <View style={styles.emblemContainer}>
              <View style={styles.emblemInner}>
                <Ionicons name="heart" size={28} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.title}>Create Sanctuary</Text>
            <Text style={styles.subtitle}>
              Begin your personalized emotional wellness sanctuary with Maya today.
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

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name or Moniker</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Elena Rostova"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
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
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Re-type your password"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Agreement */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I accept the MindFul sanctuary guidelines and commit to gentle self-compassion.
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.submitBtnText}>Create Account</Text>
                  <Ionicons name="leaf" size={18} color={colors.textInverse} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Switch to Login */}
          <View style={styles.switchSection}>
            <Text style={styles.switchPrompt}>Already have a sanctuary account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.switchAction}> Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Security & Confidentiality Footer */}
          <View style={styles.privacyNote}>
            <Ionicons name="lock-closed" size={13} color={colors.textMuted} />
            <Text style={styles.privacyNoteText}>
              All reflections & thoughts are confidential and securely stored.
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edd8fe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 4,
  },
  badgePillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: '#685878',
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
    backgroundColor: 'rgba(237, 216, 254, 0.45)',
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
    backgroundColor: '#c8ead9',
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
  inputLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMain,
    marginBottom: spacing.xs,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
    lineHeight: 18,
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

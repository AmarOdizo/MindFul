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
              <Ionicons name="arrow-back" size={20} color={colors.textMain} />
            </TouchableOpacity>
            <View style={styles.sanctuaryBadge}>
              <Ionicons name="shield-checkmark" size={13} color="#059669" />
              <Text style={styles.sanctuaryBadgeText}>Secure Sanctuary</Text>
            </View>
          </View>

          {/* Brand Header */}
          <View style={styles.headerSection}>
            <View style={styles.emblemAura}>
              <View style={styles.emblemCircle}>
                <Ionicons name="leaf" size={26} color="#059669" />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Take a gentle breath and return to your mindful space.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor="#94A3B8"
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
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
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
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={styles.btnContent}>
                  <Text style={styles.submitBtnText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
              activeOpacity={0.75}
            >
              <Ionicons name="sparkles-outline" size={16} color="#059669" />
              <Text style={styles.guestBtnText}>Explore Sanctuary as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Switcher */}
          <View style={styles.switchSection}>
            <Text style={styles.switchPrompt}>New to MindFul?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
              <Text style={styles.switchAction}> Create an account</Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Guarantee */}
          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#94A3B8" />
            <Text style={styles.privacyNoteText}>
              100% Private • End-to-End Encrypted Sanctuary
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
    backgroundColor: '#FAF9F6',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sanctuaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  sanctuaryBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#059669',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emblemAura: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  emblemCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 26,
    color: '#1C2541',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#5C677D',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBannerText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#DC2626',
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#334155',
    marginBottom: 5,
  },
  forgotText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#059669',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: '#1C2541',
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#94A3B8',
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  guestBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#059669',
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  switchPrompt: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#64748B',
  },
  switchAction: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#059669',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
  },
  privacyNoteText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10,
    color: '#94A3B8',
  },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

// Helper to robustly extract both hash fragments (#...) and query parameters (?...)
export function parseAuthUrl(url) {
  if (!url) return {};
  const params = {};

  // 1. Parse Hash Fragment (#access_token=...&error=...)
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hashString = url.substring(hashIndex + 1);
    const hashPairs = hashString.split('&');
    for (const pair of hashPairs) {
      const [key, value] = pair.split('=');
      if (key) {
        const decodedKey = decodeURIComponent(key.replace(/\+/g, ' '));
        const decodedVal = decodeURIComponent((value || '').replace(/\+/g, ' '));
        params[decodedKey] = decodedVal;
      }
    }
  }

  // 2. Parse Query String (?code=...&error=...)
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    const end = hashIndex !== -1 && hashIndex > queryIndex ? hashIndex : url.length;
    const queryString = url.substring(queryIndex + 1, end);
    const queryPairs = queryString.split('&');
    for (const pair of queryPairs) {
      const [key, value] = pair.split('=');
      if (key) {
        const decodedKey = decodeURIComponent(key.replace(/\+/g, ' '));
        const decodedVal = decodeURIComponent((value || '').replace(/\+/g, ' '));
        if (!params[decodedKey]) {
          params[decodedKey] = decodedVal;
        }
      }
    }
  }

  return params;
}

export default function VerifyEmailScreen({ navigation, route }) {
  const { setSession } = useAuth();

  const initialEmail = route?.params?.email || '';
  const justRegistered = route?.params?.justRegistered || false;

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);

  // States: 'pending' | 'verifying' | 'success' | 'expired' | 'invalid' | 'already_verified'
  const [status, setStatus] = useState('pending');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Resend Cooldown Management
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef(null);

  // Start 60-second cooldown timer
  const startCooldown = (seconds = 60) => {
    setCooldownSeconds(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Process incoming deep link parameters
  const processDeepLink = async (url) => {
    if (!url) return;
    console.log('[VerifyEmail] Incoming deep link URL:', url);

    const params = parseAuthUrl(url);

    // Check for errors returned in redirect
    if (params.error || params.error_code) {
      const errorCode = (params.error_code || params.error || '').toLowerCase();
      const errorDesc = params.error_description || '';

      if (errorCode.includes('otp_expired') || errorDesc.toLowerCase().includes('expired')) {
        setStatus('expired');
        setStatusMessage('Your verification link has expired. Please request a new link below.');
      } else if (
        errorCode.includes('already_confirmed') ||
        errorDesc.toLowerCase().includes('already confirmed')
      ) {
        setStatus('already_verified');
        setStatusMessage('Your email is already verified! You can proceed directly to sign in.');
      } else {
        setStatus('invalid');
        setStatusMessage(
          errorDesc || 'The verification link is invalid or has already been used. Please request a new link.'
        );
      }
      return;
    }

    // Check for tokens (access_token, token_hash, or code)
    if (params.access_token || params.token_hash || params.code) {
      setStatus('verifying');
      setErrorMessage('');
      try {
        const result = await authApi.verifyEmail({
          access_token: params.access_token,
          token_hash: params.token_hash,
          code: params.code,
          type: params.type || 'signup',
        });

        if (result && result.verified) {
          setStatus('success');
          setStatusMessage('Your email has been verified! Welcome to MindFul.');
          if (result.user && result.token) {
            setSession(result.user, result.token);
          }
        } else {
          setStatus('invalid');
          setStatusMessage(result?.error || 'Verification could not be confirmed.');
        }
      } catch (err) {
        const isExp =
          err.code === 'OTP_EXPIRED' ||
          (err.message && err.message.toLowerCase().includes('expired'));

        if (isExp) {
          setStatus('expired');
          setStatusMessage('Your email verification link has expired. Please request a new link.');
        } else {
          setStatus('invalid');
          setStatusMessage(err.message || 'Verification failed. Please try again.');
        }
      }
    }
  };

  // Deep Link Listeners (cold-launch and foreground events)
  useEffect(() => {
    // 1. Handle app launch from deep link
    Linking.getInitialURL().then((url) => {
      if (url && (url.includes('verify') || url.includes('callback') || url.includes('mindful://'))) {
        processDeepLink(url);
      }
    });

    // 2. Handle deep link while app is running in background or foreground
    const subscription = Linking.addEventListener('url', (event) => {
      if (event?.url) {
        processDeepLink(event.url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle Resend Verification Email
  const handleResend = async () => {
    if (cooldownSeconds > 0 || isResending) return;

    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive the link');
      return;
    }

    setErrorMessage('');
    setSuccessNotice('');
    setIsResending(true);

    try {
      const response = await authApi.resendVerification(email.trim());
      setSuccessNotice(
        response.message || 'A fresh verification link has been sent! Please check your inbox.'
      );
      startCooldown(60);
      // If we were in expired/invalid state, return to pending
      if (status === 'expired' || status === 'invalid') {
        setStatus('pending');
      }
    } catch (err) {
      console.warn('Resend failed:', err);
      if (err.status === 429 || err.code === 'RATE_LIMIT_EXCEEDED') {
        setErrorMessage(
          'Email rate limit reached. Please wait a minute before requesting another link, or check your spam folder.'
        );
        startCooldown(60);
      } else {
        setErrorMessage(err.message || 'Failed to resend verification email. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  // Render Status Icon & Header depending on verification state
  const renderStateHeader = () => {
    switch (status) {
      case 'verifying':
        return (
          <View style={styles.headerBlock}>
            <View style={[styles.emblemAura, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <ActivityIndicator size="large" color="#059669" />
            </View>
            <Text style={styles.title}>Verifying Sanctuary</Text>
            <Text style={styles.subtitle}>
              Confirming your email credentials with Supabase...
            </Text>
          </View>
        );

      case 'success':
        return (
          <View style={styles.headerBlock}>
            <View style={[styles.emblemAura, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <View style={styles.emblemCircle}>
                <Ionicons name="checkmark-circle" size={32} color="#059669" />
              </View>
            </View>
            <Text style={styles.title}>Sanctuary Activated</Text>
            <Text style={styles.subtitle}>
              {statusMessage || 'Your email address has been successfully verified!'}
            </Text>
          </View>
        );

      case 'expired':
        return (
          <View style={styles.headerBlock}>
            <View style={[styles.emblemAura, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <View style={styles.emblemCircle}>
                <Ionicons name="time-outline" size={30} color="#D97706" />
              </View>
            </View>
            <Text style={styles.title}>Link Expired</Text>
            <Text style={styles.subtitle}>
              {statusMessage || 'Verification links expire after 24 hours. Request a fresh link below.'}
            </Text>
          </View>
        );

      case 'already_verified':
        return (
          <View style={styles.headerBlock}>
            <View style={[styles.emblemAura, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <View style={styles.emblemCircle}>
                <Ionicons name="shield-checkmark" size={30} color="#059669" />
              </View>
            </View>
            <Text style={styles.title}>Already Verified</Text>
            <Text style={styles.subtitle}>
              {statusMessage || 'This email address has already been verified. You can sign in now.'}
            </Text>
          </View>
        );

      case 'invalid':
        return (
          <View style={styles.headerBlock}>
            <View style={[styles.emblemAura, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
              <View style={styles.emblemCircle}>
                <Ionicons name="alert-circle-outline" size={30} color="#DC2626" />
              </View>
            </View>
            <Text style={styles.title}>Invalid Link</Text>
            <Text style={styles.subtitle}>
              {statusMessage || 'This link is invalid or incomplete. You can request a new verification email.'}
            </Text>
          </View>
        );

      case 'pending':
      default:
        return (
          <View style={styles.headerBlock}>
            <View style={styles.emblemAura}>
              <View style={styles.emblemCircle}>
                <Ionicons name="mail-outline" size={28} color="#059669" />
              </View>
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              {justRegistered
                ? 'Welcome to MindFul! Please verify your email to unlock your personal sanctuary.'
                : 'A confirmation link has been sent to your email. Click it to verify your account.'}
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Navigation */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textMain} />
          </TouchableOpacity>
          <View style={styles.badgePill}>
            <Ionicons name="shield-checkmark" size={13} color="#059669" />
            <Text style={styles.badgePillText}>MindFul Sanctuary</Text>
          </View>
        </View>

        {/* Dynamic State Header */}
        {renderStateHeader()}

        {/* Card Section */}
        <View style={styles.mainCard}>
          {/* Success Banner */}
          {successNotice ? (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.successBannerText}>{successNotice}</Text>
            </View>
          ) : null}

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Target Display / Editor */}
          {status !== 'success' && status !== 'already_verified' ? (
            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>Verification Target Email</Text>
              {isEditingEmail ? (
                <View style={styles.emailInputRow}>
                  <TextInput
                    style={styles.emailInput}
                    placeholder="name@example.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {email ? (
                    <TouchableOpacity
                      style={styles.doneEditBtn}
                      onPress={() => setIsEditingEmail(false)}
                    >
                      <Ionicons name="checkmark" size={18} color="#059669" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : (
                <View style={styles.emailPillRow}>
                  <Ionicons name="mail" size={16} color="#059669" />
                  <Text style={styles.emailPillText} numberOfLines={1}>
                    {email || 'No email provided'}
                  </Text>
                  <TouchableOpacity
                    style={styles.editEmailBtn}
                    onPress={() => setIsEditingEmail(true)}
                  >
                    <Ionicons name="pencil" size={13} color="#64748B" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}

          {/* Action Area based on state */}
          {status === 'success' ? (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                });
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Enter MindFul Sanctuary</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : status === 'already_verified' ? (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Proceed to Sign In</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.actionsContainer}>
              {/* Instructions Guide */}
              <View style={styles.guideBox}>
                <View style={styles.guideStep}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNum}>1</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Open the confirmation link in the email sent by Supabase.
                  </Text>
                </View>
                <View style={styles.guideStep}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNum}>2</Text>
                  </View>
                  <Text style={styles.stepText}>
                    The link will automatically verify and return you to MindFul.
                  </Text>
                </View>
                <View style={styles.guideStep}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNum}>3</Text>
                  </View>
                  <Text style={styles.stepText}>
                    Once confirmed, your account is activated and ready to sign in.
                  </Text>
                </View>
              </View>

              {/* Resend Verification Button */}
              <TouchableOpacity
                style={[
                  styles.resendBtn,
                  (cooldownSeconds > 0 || isResending) && styles.resendBtnDisabled,
                ]}
                onPress={handleResend}
                disabled={cooldownSeconds > 0 || isResending}
                activeOpacity={0.8}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : (
                  <View style={styles.btnRow}>
                    <Ionicons
                      name="refresh-outline"
                      size={16}
                      color={cooldownSeconds > 0 ? '#94A3B8' : '#059669'}
                    />
                    <Text
                      style={[
                        styles.resendBtnText,
                        cooldownSeconds > 0 && styles.resendBtnTextDisabled,
                      ]}
                    >
                      {cooldownSeconds > 0
                        ? `Resend Email in ${cooldownSeconds}s`
                        : 'Resend Verification Email'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Already verified button */}
              <TouchableOpacity
                style={styles.signInBtn}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
              >
                <Text style={styles.signInBtnText}>I've Verified, Sign In</Text>
                <Ionicons name="arrow-forward" size={14} color="#1C2541" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Support Help */}
        <View style={styles.footerHelp}>
          <Ionicons name="help-circle-outline" size={14} color="#94A3B8" />
          <Text style={styles.footerHelpText}>
            Didn't receive an email? Check your spam/junk folder or wait 60s to resend.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgePillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: colors.primary,
  },
  headerBlock: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 20,
  },
  emblemAura: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  emblemCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontFamily: typography.fontFamily.serifSemiBold,
    fontSize: 24,
    color: colors.textMain,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  successBannerText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#065F46',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
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
  emailContainer: {
    marginBottom: 16,
  },
  emailLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emailPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  emailPillText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: colors.textMain,
  },
  editEmailBtn: {
    padding: 6,
  },
  emailInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    height: 48,
  },
  emailInput: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: colors.textMain,
  },
  doneEditBtn: {
    padding: 6,
  },
  actionsContainer: {
    gap: 12,
  },
  guideBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 4,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
    color: '#475569',
  },
  stepText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16.5,
  },
  primaryBtn: {
    minHeight: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14.5,
    color: colors.textInverse,
  },
  resendBtn: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resendBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: colors.primary,
  },
  resendBtnTextDisabled: {
    color: '#94A3B8',
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  signInBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: colors.textMain,
  },
  footerHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  footerHelpText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { colors, typography, spacing, radius } from '../theme';

// Dynamic Colorful Breathing Phase Themes
const PHASE_THEMES = {
  Inhale: {
    duration: 4,
    next: 'Hold',
    color: '#059669', // Vibrant Emerald
    gradientBg: '#ECFDF5',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    border: '#6EE7B7',
    badgeBg: '#D1FAE5',
    icon: 'leaf',
    label: 'Inhale',
    secondsText: '4s',
  },
  Hold: {
    duration: 7,
    next: 'Exhale',
    color: '#7C3AED', // Vibrant Amethyst Violet
    gradientBg: '#F5F3FF',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    border: '#C4B5FD',
    badgeBg: '#EDE9FE',
    icon: 'planet',
    label: 'Hold',
    secondsText: '7s',
  },
  Exhale: {
    duration: 8,
    next: 'Inhale',
    color: '#E11D48', // Warm Sunset Rose Coral
    gradientBg: '#FFF1F2',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    border: '#FDA4AF',
    badgeBg: '#FFE4E6',
    icon: 'sparkles',
    label: 'Exhale',
    secondsText: '8s',
  },
};

// Empathetic Mindfulness Coach Scripts (English & Hindi)
const COACH_SCRIPTS = {
  en: {
    Inhale: {
      voice: 'Breathe in gently through your nose, deep into your belly.',
      cue: 'Deep belly breath • Expanding lungs',
      action: 'Inhale through nose',
    },
    Hold: {
      voice: 'Hold your breath. Relax your shoulders and rest in the calm stillness.',
      cue: 'Rest in the pause • Relax shoulders',
      action: 'Hold gently',
    },
    Exhale: {
      voice: 'Exhale slowly through your mouth, releasing all tension completely.',
      cue: 'Release completely • Let stress go',
      action: 'Exhale through mouth',
    },
  },
  hi: {
    Inhale: {
      voice: 'Naak se dheere se saans andar lein, pet ko aaram se phoolne dein.',
      cue: 'Gehri saans andar lein • Aaram se',
      action: 'Naak se saans lein',
    },
    Hold: {
      voice: 'Saans ko rokein. Kandhon ko dheela chhodkar shaanti mehsoos karein.',
      cue: 'Saans thehraayein • Shaanti me thehre',
      action: 'Saans rokein',
    },
    Exhale: {
      voice: 'Muh se dheere se saans bahar chhodein, saara tanav nikaal dein.',
      cue: 'Dheere se chhoden • Tanav mukt',
      action: 'Muh se saans chhoden',
    },
  },
};

export default function MeditationScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.35)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim1 = useRef(new Animated.Value(1)).current;
  const waveAnim2 = useRef(new Animated.Value(1)).current;

  const [phase, setPhase] = useState('Inhale'); // 'Inhale' (4s), 'Hold' (7s), 'Exhale' (8s)
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceLang, setVoiceLang] = useState('en'); // 'en' or 'hi'

  const activeTheme = PHASE_THEMES[phase];

  // Safe voice synthesis function
  const speakInstruction = useCallback(
    (phaseKey, lang = voiceLang) => {
      if (!voiceEnabled) return;

      const scriptObj = COACH_SCRIPTS[lang]?.[phaseKey] || COACH_SCRIPTS.en[phaseKey];
      if (!scriptObj) return;

      try {
        Speech.stop();

        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(scriptObj.voice);
          utterance.rate = 0.85;
          utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
          window.speechSynthesis.speak(utterance);
        } else {
          Speech.speak(scriptObj.voice, {
            language: lang === 'hi' ? 'hi-IN' : 'en-US',
            pitch: 1.0,
            rate: 0.82,
          });
        }
      } catch (e) {
        console.warn('Speech synthesis notice:', e.message);
      }
    },
    [voiceEnabled, voiceLang]
  );

  const stopVoice = () => {
    try {
      Speech.stop();
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      // ignore
    }
  };

  // Synchronized Breathing Orb Animations
  const triggerAnimation = useCallback(
    (nextPhase) => {
      if (nextPhase === 'Inhale') {
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 2.3, duration: 4000, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.1, duration: 4000, useNativeDriver: true }),
          Animated.timing(waveAnim1, { toValue: 1.3, duration: 4000, useNativeDriver: true }),
          Animated.timing(waveAnim2, { toValue: 1.5, duration: 4000, useNativeDriver: true }),
        ]).start();
      } else if (nextPhase === 'Hold') {
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 1750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.98, duration: 1750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 1750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 1750, useNativeDriver: true }),
        ]).start();
      } else if (nextPhase === 'Exhale') {
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1.0, duration: 8000, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.35, duration: 8000, useNativeDriver: true }),
          Animated.timing(waveAnim1, { toValue: 1.0, duration: 8000, useNativeDriver: true }),
          Animated.timing(waveAnim2, { toValue: 1.0, duration: 8000, useNativeDriver: true }),
        ]).start();
      }
    },
    [scaleAnim, opacityAnim, pulseAnim, waveAnim1, waveAnim2]
  );

  useEffect(() => {
    triggerAnimation('Inhale');
    speakInstruction('Inhale', voiceLang);

    return () => {
      stopVoice();
    };
  }, []);

  // Main countdown timer loop
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            const currentConf = PHASE_THEMES[phase];
            const nextPhase = currentConf.next;

            if (nextPhase === 'Inhale') {
              setCycle((prevCycle) => (prevCycle < 8 ? prevCycle + 1 : 1));
            }

            setPhase(nextPhase);
            triggerAnimation(nextPhase);
            speakInstruction(nextPhase, voiceLang);

            return PHASE_THEMES[nextPhase].duration;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, phase, voiceLang, speakInstruction, triggerAnimation]);

  const togglePlayback = () => {
    if (isRunning) {
      setIsRunning(false);
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
      pulseAnim.stopAnimation();
      stopVoice();
    } else {
      setIsRunning(true);
      triggerAnimation(phase);
      speakInstruction(phase, voiceLang);
    }
  };

  const restartSession = () => {
    stopVoice();
    setPhase('Inhale');
    setTimeLeft(4);
    setCycle(1);
    setIsRunning(true);
    triggerAnimation('Inhale');
    speakInstruction('Inhale', voiceLang);
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopVoice();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      speakInstruction(phase, voiceLang);
    }
  };

  const switchLanguage = (newLang) => {
    setVoiceLang(newLang);
    if (voiceEnabled && isRunning) {
      speakInstruction(phase, newLang);
    }
  };

  const currentScript = COACH_SCRIPTS[voiceLang]?.[phase] || COACH_SCRIPTS.en[phase];

  // Active progress percentage within the phase duration
  const phaseProgressPct = useMemo(() => {
    const totalSec = activeTheme.duration;
    const elapsed = totalSec - timeLeft;
    return Math.max(5, Math.min(100, (elapsed / totalSec) * 100));
  }, [timeLeft, activeTheme]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: activeTheme.gradientBg }]}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            stopVoice();
            navigation.goBack();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={22} color={colors.textMain} />
        </TouchableOpacity>

        {/* Dynamic Center Title Badge */}
        <View style={[styles.headerCenterBadge, { backgroundColor: '#FFFFFF', borderColor: activeTheme.border }]}>
          <View style={[styles.statusDot, { backgroundColor: activeTheme.color }]} />
          <Text style={[styles.headerBadgeText, { color: activeTheme.color }]}>
            {phase.toUpperCase()} FLOW
          </Text>
        </View>

        {/* Right Action Controls: Lang & Voice Mute */}
        <View style={styles.headerRightArea}>
          {/* Language Switcher Pill */}
          <View style={styles.langSwitchPill}>
            <TouchableOpacity
              onPress={() => switchLanguage('en')}
              style={[styles.langBtn, voiceLang === 'en' && { backgroundColor: activeTheme.badgeBg }]}
            >
              <Text
                style={[
                  styles.langBtnText,
                  voiceLang === 'en' && { color: activeTheme.color, fontWeight: '700' },
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => switchLanguage('hi')}
              style={[styles.langBtn, voiceLang === 'hi' && { backgroundColor: activeTheme.badgeBg }]}
            >
              <Text
                style={[
                  styles.langBtnText,
                  voiceLang === 'hi' && { color: activeTheme.color, fontWeight: '700' },
                ]}
              >
                हिं
              </Text>
            </TouchableOpacity>
          </View>

          {/* Voice Coach Toggle Button */}
          <TouchableOpacity
            style={[
              styles.voiceCoachToggle,
              voiceEnabled ? { backgroundColor: activeTheme.badgeBg, borderColor: activeTheme.border } : styles.voiceCoachToggleMuted,
            ]}
            onPress={toggleVoice}
            activeOpacity={0.8}
          >
            <Ionicons
              name={voiceEnabled ? 'volume-high' : 'volume-mute'}
              size={17}
              color={voiceEnabled ? activeTheme.color : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Colorful Title & Benefit Badge */}
        <View style={styles.titleArea}>
          <View style={[styles.vagusBadge, { backgroundColor: '#FFFFFF', borderColor: activeTheme.border }]}>
            <Ionicons name="sparkles" size={13} color={activeTheme.color} />
            <Text style={[styles.vagusBadgeText, { color: activeTheme.color }]}>
              VAGUS NERVE CALM • 5 MIN RESCUE
            </Text>
          </View>
          <Text style={styles.mainTitle}>4-7-8 Breathing Sanctuary</Text>
        </View>

        {/* Dynamic Coach Voice Card with Soundwave Animation */}
        <View style={[styles.coachSpeechCard, { borderColor: activeTheme.border }]}>
          <View style={styles.coachHeaderRow}>
            <View style={styles.coachBadgeLeft}>
              <View style={[styles.coachAvatar, { backgroundColor: activeTheme.badgeBg }]}>
                <Ionicons
                  name={voiceEnabled && isRunning ? 'mic' : 'mic-off'}
                  size={14}
                  color={activeTheme.color}
                />
              </View>
              <Text style={[styles.coachNameText, { color: activeTheme.color }]}>
                Maya Voice Coach
              </Text>
              {/* Animated Soundwave EQ Bars */}
              {isRunning && voiceEnabled && (
                <View style={styles.soundWaveBars}>
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 8 }]} />
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 14 }]} />
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 10 }]} />
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 16 }]} />
                </View>
              )}
            </View>
            <View style={[styles.cuePill, { backgroundColor: activeTheme.badgeBg }]}>
              <Text style={[styles.cuePillText, { color: activeTheme.color }]}>
                {currentScript.action}
              </Text>
            </View>
          </View>
          <Text style={styles.coachSpeechQuote}>“{currentScript.voice}”</Text>
        </View>

        {/* Concentric Breathing Orb & Pulsing Waves */}
        <View style={styles.orbStage}>
          {/* Outer Ripple Wave 2 */}
          <Animated.View
            style={[
              styles.waveRing,
              {
                width: 250,
                height: 250,
                borderRadius: 125,
                backgroundColor: activeTheme.glowColor,
                transform: [{ scale: waveAnim2 }],
                opacity: opacityAnim,
              },
            ]}
          />

          {/* Outer Ripple Wave 1 */}
          <Animated.View
            style={[
              styles.waveRing,
              {
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: activeTheme.glowColor,
                transform: [{ scale: waveAnim1 }],
                opacity: opacityAnim,
              },
            ]}
          />

          {/* Primary Pulsing Circle */}
          <Animated.View
            style={[
              styles.primaryCircleAura,
              {
                backgroundColor: activeTheme.color,
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          />

          {/* Frosted Sacred Core Container */}
          <Animated.View
            style={[
              styles.crystalCenterCore,
              {
                borderColor: activeTheme.border,
                transform: [{ scale: phase === 'Hold' ? pulseAnim : 1 }],
              },
            ]}
          >
            {/* Phase Decorative Emblem */}
            <View style={[styles.phaseEmblemBox, { backgroundColor: activeTheme.badgeBg }]}>
              <Ionicons name={activeTheme.icon} size={28} color={activeTheme.color} />
            </View>

            <Text style={[styles.phaseTitleText, { color: activeTheme.color }]}>
              {phase}
            </Text>
            <Text style={styles.timerDisplayNumber}>{timeLeft}s</Text>
            <Text style={styles.phaseActionSubtext}>{currentScript.cue}</Text>
          </Animated.View>
        </View>

        {/* 8-Cycle Milestone Pearl Dots */}
        <View style={styles.cycleMilestoneBox}>
          <View style={styles.cyclePearlRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((cNum) => {
              const isPast = cNum < cycle;
              const isCurrent = cNum === cycle;
              return (
                <View
                  key={cNum}
                  style={[
                    styles.cyclePearl,
                    isPast && { backgroundColor: activeTheme.color },
                    isCurrent && [styles.cyclePearlActive, { borderColor: activeTheme.color, backgroundColor: activeTheme.badgeBg }],
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.cycleMilestoneText}>
            Cycle {cycle} of 8 • Deep Autonomic Harmony
          </Text>
        </View>

        {/* 3 Color-Coded Phase Cards (Inhale 4s, Hold 7s, Exhale 8s) */}
        <View style={styles.phaseCardsRow}>
          {['Inhale', 'Hold', 'Exhale'].map((pKey) => {
            const pTheme = PHASE_THEMES[pKey];
            const isThisActive = phase === pKey;
            return (
              <View
                key={pKey}
                style={[
                  styles.phaseCard,
                  isThisActive
                    ? [styles.phaseCardActive, { borderColor: pTheme.color, backgroundColor: '#FFFFFF' }]
                    : styles.phaseCardInactive,
                ]}
              >
                {/* Active Progress Bar at top of card */}
                {isThisActive && (
                  <View style={styles.cardProgressBarBg}>
                    <View
                      style={[
                        styles.cardProgressBarFill,
                        { width: `${phaseProgressPct}%`, backgroundColor: pTheme.color },
                      ]}
                    />
                  </View>
                )}

                <View style={[styles.phaseIconCircle, { backgroundColor: pTheme.badgeBg }]}>
                  <Ionicons name={pTheme.icon} size={16} color={pTheme.color} />
                </View>
                <Text
                  style={[
                    styles.phaseCardLabel,
                    isThisActive && { color: pTheme.color, fontWeight: '700' },
                  ]}
                >
                  {pTheme.label}
                </Text>
                <Text
                  style={[
                    styles.phaseCardSec,
                    isThisActive && { color: pTheme.color, fontWeight: '700' },
                  ]}
                >
                  {pTheme.secondsText}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Bottom Play, Pause & Restart Controller Deck */}
        <View style={styles.actionDeckRow}>
          <TouchableOpacity
            style={styles.restartMiniBtn}
            onPress={restartSession}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="refresh" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryPlayBtn, { backgroundColor: activeTheme.color }]}
            onPress={togglePlayback}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={22}
              color={colors.textInverse}
            />
            <Text style={styles.primaryPlayBtnText}>
              {isRunning ? 'Pause Breath Flow' : 'Resume Breath Flow'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCenterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  headerBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    letterSpacing: 0.8,
  },
  headerRightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langSwitchPill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  langBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: colors.textMuted,
  },
  voiceCoachToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  voiceCoachToggleMuted: {
    borderColor: 'transparent',
    backgroundColor: '#F3F4F9',
  },
  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },

  /* Title Area */
  titleArea: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  vagusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 5,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  vagusBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  /* Coach Speech Card */
  coachSpeechCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: spacing.xs,
  },
  coachHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  coachBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coachAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachNameText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  soundWaveBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginLeft: 4,
    height: 16,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
  },
  cuePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  cuePillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
  },
  coachSpeechQuote: {
    fontFamily: typography.fontFamily.serifRegular,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  /* Orb Stage */
  orbStage: {
    width: '100%',
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: spacing.xs,
  },
  waveRing: {
    position: 'absolute',
  },
  primaryCircleAura: {
    width: 140,
    height: 140,
    borderRadius: 70,
    position: 'absolute',
  },
  crystalCenterCore: {
    width: 174,
    height: 174,
    borderRadius: 87,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 10,
  },
  phaseEmblemBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  phaseTitleText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timerDisplayNumber: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.displayLgMobile + 4,
    color: colors.textMain,
    marginVertical: 1,
  },
  phaseActionSubtext: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  /* 8-Cycle Milestone */
  cycleMilestoneBox: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  cyclePearlRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  cyclePearl: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  cyclePearlActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  cycleMilestoneText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },

  /* 3 Phases Indicator Cards Row */
  phaseCardsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginVertical: spacing.sm,
  },
  phaseCard: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  phaseCardActive: {
    elevation: 4,
    shadowOpacity: 0.12,
  },
  phaseCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    opacity: 0.75,
  },
  cardProgressBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EEF2F6',
  },
  cardProgressBarFill: {
    height: '100%',
  },
  phaseIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  phaseCardLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
  },
  phaseCardSec: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.bodyLg,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* Bottom Actions */
  actionDeckRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.xs,
  },
  restartMiniBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryPlayBtn: {
    flex: 1,
    height: 52,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryPlayBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textInverse,
  },
});

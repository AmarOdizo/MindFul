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
          Animated.timing(scaleAnim, { toValue: 1.7, duration: 4000, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.1, duration: 4000, useNativeDriver: true }),
          Animated.timing(waveAnim1, { toValue: 1.2, duration: 4000, useNativeDriver: true }),
          Animated.timing(waveAnim2, { toValue: 1.35, duration: 4000, useNativeDriver: true }),
        ]).start();
      } else if (nextPhase === 'Hold') {
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.98, duration: 1750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 1750, useNativeDriver: true }),
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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color={colors.textMain} />
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
              size={15}
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
            <Ionicons name="sparkles" size={11} color={activeTheme.color} />
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
                  size={12}
                  color={activeTheme.color}
                />
              </View>
              <Text style={[styles.coachNameText, { color: activeTheme.color }]}>
                Maya Voice Coach
              </Text>
              {/* Animated Soundwave EQ Bars */}
              {isRunning && voiceEnabled && (
                <View style={styles.soundWaveBars}>
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 6 }]} />
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 11 }]} />
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 8 }]} />
                  <View style={[styles.waveBar, { backgroundColor: activeTheme.color, height: 13 }]} />
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
                width: 190,
                height: 190,
                borderRadius: 95,
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
                width: 155,
                height: 155,
                borderRadius: 77.5,
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
              <Ionicons name={activeTheme.icon} size={20} color={activeTheme.color} />
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
                  <Ionicons name={pTheme.icon} size={13} color={pTheme.color} />
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
            <Ionicons name="refresh" size={17} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryPlayBtn, { backgroundColor: activeTheme.color }]}
            onPress={togglePlayback}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={18}
              color={colors.textInverse}
            />
            <Text style={styles.primaryPlayBtnText}>
              {isRunning ? 'Pause Breath Flow' : 'Resume Breath Flow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* CRISIS SUPPORT CARD                                       */}
        {/* ========================================================= */}
        <View style={styles.crisisCard}>
          <View style={styles.crisisHeader}>
            <View style={styles.crisisIconCircle}>
              <Ionicons name="shield-checkmark" size={13} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.crisisTitle}>Need Immediate Human Support?</Text>
              <Text style={styles.crisisSubtitle}>
                Free, confidential crisis helplines and compassionate professionals available 24/7.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.crisisBtn}
            onPress={() => navigation.navigate('CrisisSupport')}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={12} color="#FFFFFF" />
            <Text style={styles.crisisBtnText}>Access Crisis Support Line</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCenterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  headerBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9.5,
    letterSpacing: 0.6,
  },
  headerRightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langSwitchPill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  langBtn: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: radius.pill,
  },
  langBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  voiceCoachToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },

  /* Title Area */
  titleArea: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  vagusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  vagusBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 8.5,
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 17,
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '700',
  },

  /* Coach Speech Card */
  coachSpeechCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 3,
  },
  coachHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  coachBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coachAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachNameText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
  soundWaveBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginLeft: 3,
    height: 12,
  },
  waveBar: {
    width: 2.5,
    borderRadius: 1.2,
  },
  cuePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  cuePillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9,
  },
  coachSpeechQuote: {
    fontFamily: typography.fontFamily.serifRegular,
    fontSize: 11.5,
    color: colors.textMain,
    fontStyle: 'italic',
    lineHeight: 16,
  },

  /* Orb Stage */
  orbStage: {
    width: '100%',
    height: 195,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 3,
  },
  waveRing: {
    position: 'absolute',
  },
  primaryCircleAura: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
  },
  crystalCenterCore: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  phaseEmblemBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  phaseTitleText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  timerDisplayNumber: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 24,
    color: colors.textMain,
    marginVertical: 0,
    lineHeight: 28,
  },
  phaseActionSubtext: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 8.5,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  /* 8-Cycle Milestone */
  cycleMilestoneBox: {
    alignItems: 'center',
    marginVertical: 3,
  },
  cyclePearlRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 4,
  },
  cyclePearl: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  cyclePearlActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  cycleMilestoneText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: colors.textMuted,
  },

  /* 3 Phases Indicator Cards Row */
  phaseCardsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 7,
    marginVertical: 5,
  },
  phaseCard: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: 'center',
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  phaseCardActive: {
    elevation: 3,
    shadowOpacity: 0.1,
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
    height: 2.5,
    backgroundColor: '#EEF2F6',
  },
  cardProgressBarFill: {
    height: '100%',
  },
  phaseIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  phaseCardLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  phaseCardSec: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },

  /* Bottom Actions */
  actionDeckRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  restartMiniBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryPlayBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryPlayBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textInverse,
  },

  /* Crisis Support Card */
  crisisCard: {
    width: '100%',
    backgroundColor: '#FFF1F2',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  crisisIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crisisTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
    color: '#E11D48',
    marginBottom: 1,
  },
  crisisSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 9.5,
    color: '#64748B',
    lineHeight: 13.5,
  },
  crisisBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 5,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  crisisBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
});

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

export default function MeditationScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;
  
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  // Phases configuration
  const PHASES = {
    Inhale: { duration: 4, next: 'Hold', cue: 'Deep into belly' },
    Hold: { duration: 7, next: 'Exhale', cue: 'Rest in the pause' },
    Exhale: { duration: 8, next: 'Inhale', cue: 'Release completely' },
  };

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Transition to next phase
            const currentPhaseConf = PHASES[phase];
            const nextPhase = currentPhaseConf.next;
            
            if (nextPhase === 'Inhale') {
              setCycle(prevCycle => prevCycle < 8 ? prevCycle + 1 : 1);
            }
            
            setPhase(nextPhase);
            triggerAnimation(nextPhase);
            
            return PHASES[nextPhase].duration;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, phase]);

  const triggerAnimation = (nextPhase) => {
    if (nextPhase === 'Inhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 2.2, duration: 4000, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.1, duration: 4000, useNativeDriver: true })
      ]).start();
    } else if (nextPhase === 'Hold') {
      // Keep state
    } else if (nextPhase === 'Exhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.4, duration: 8000, useNativeDriver: true })
      ]).start();
    }
  };

  useEffect(() => {
    // Initial animation trigger
    triggerAnimation('Inhale');
  }, []);

  const togglePlayback = () => {
    setIsRunning(!isRunning);
    if (isRunning) {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    } else {
      triggerAnimation(phase);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>Vagus Nerve Reset · 5 Minutes</Text>
          <Text style={styles.title}>4-7-8 Relaxing Breath</Text>
        </View>

        <View style={styles.animationContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]} />
          
          <View style={styles.centerCore}>
            <Ionicons name="leaf-outline" size={32} color={colors.primary} style={{ marginBottom: 4 }} />
            <Text style={styles.instructionText}>{phase}...</Text>
            <Text style={styles.timerText}>{timeLeft}s</Text>
            <Text style={styles.cueText}>{PHASES[phase].cue}</Text>
          </View>
        </View>

        <View style={styles.cycleBadge}>
          <View style={styles.cycleDot} />
          <Text style={styles.cycleText}>Cycle {cycle} of 8</Text>
        </View>

        <View style={styles.phasesRow}>
          <View style={[styles.phaseBox, phase === 'Inhale' && styles.phaseBoxActive]}>
            <Text style={[styles.phaseLabel, phase === 'Inhale' && styles.phaseLabelActive]}>Inhale</Text>
            <Text style={[styles.phaseTime, phase === 'Inhale' && styles.phaseLabelActive]}>4s</Text>
          </View>
          <View style={[styles.phaseBox, phase === 'Hold' && styles.phaseBoxActive]}>
            <Text style={[styles.phaseLabel, phase === 'Hold' && styles.phaseLabelActive]}>Hold</Text>
            <Text style={[styles.phaseTime, phase === 'Hold' && styles.phaseLabelActive]}>7s</Text>
          </View>
          <View style={[styles.phaseBox, phase === 'Exhale' && styles.phaseBoxActive]}>
            <Text style={[styles.phaseLabel, phase === 'Exhale' && styles.phaseLabelActive]}>Exhale</Text>
            <Text style={[styles.phaseTime, phase === 'Exhale' && styles.phaseLabelActive]}>8s</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlayback}>
          <Ionicons name={isRunning ? "pause" : "play"} size={22} color={colors.textInverse} />
          <Text style={styles.playPauseText}>{isRunning ? "Pause Flow" : "Resume Flow"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
  },
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    alignItems: 'flex-end',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3FF', // surface-container
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
  },
  animationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    position: 'absolute',
  },
  centerCore: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FAF9F6', // center surface
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  instructionText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm,
    color: colors.textMain,
  },
  timerText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.displayLgMobile,
    color: colors.primary,
    marginVertical: 4,
  },
  cueText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  cycleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  cycleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  cycleText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
  },
  phasesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xl,
  },
  phaseBox: {
    flex: 1,
    backgroundColor: '#F2F3FF',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  phaseBoxActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  phaseLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginBottom: 4,
  },
  phaseTime: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
  },
  phaseLabelActive: {
    color: colors.textInverse,
  },
  playPauseBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  playPauseText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: colors.textInverse,
    marginLeft: 8,
  }
});

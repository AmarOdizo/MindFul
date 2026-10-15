import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { moodApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Gentle, Compact Daily Affirmations
const AFFIRMATIONS = [
  {
    quote: "Quiet the mind, and the soul will gently speak.",
    author: "Ma Jaya Sati Bhagavati",
    bg: '#F4F9F6',
    border: '#E0EFE6',
    accent: '#059669',
  },
  {
    quote: "You don't have to carry your whole future today. Just this one breath.",
    author: "Mindful Reminder",
    bg: '#F7F5FC',
    border: '#EDE8F8',
    accent: '#7C3AED',
  },
  {
    quote: "Feelings come and go like clouds. Conscious breathing is your anchor.",
    author: "Thich Nhat Hanh",
    bg: '#FDFBF4',
    border: '#F9F1D8',
    accent: '#D97706',
  },
  {
    quote: "Give yourself permission to pause, reset, and simply be.",
    author: "Anne Lamott",
    bg: '#F3F7FC',
    border: '#E1EDF9',
    accent: '#2563EB',
  },
];

// 5 Compact, Expressive Mood Options
const QUICK_MOODS = [
  { id: 'happy', label: 'Joyful', emoji: '😊', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'neutral', label: 'Steady', emoji: '😐', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
  { id: 'sad', label: 'Tender', emoji: '😔', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'anxious', label: 'Tense', emoji: '⚡', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [latestMood, setLatestMood] = useState(null);
  const [moodFeedback, setMoodFeedback] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  const loadDashboard = async () => {
    try {
      const moodRes = await moodApi.getMoodHistory(1);
      if (moodRes && moodRes.data && moodRes.data.length > 0) {
        setLatestMood(moodRes.data[0]);
      }
    } catch (e) {
      // Graceful fallback
    }
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (active) loadDashboard();
      return () => { active = false; };
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  // Instant, frictionless 1-tap mood logging
  const handleSelectMood = async (m) => {
    try {
      setLatestMood({ mood_id: m.id, mood_label: m.label, intensity: 7 });
      setMoodFeedback(`Saved ${m.emoji} ${m.label}`);

      setTimeout(() => {
        setMoodFeedback(null);
      }, 3500);

      await moodApi.logMood({
        mood_id: m.id,
        mood_label: m.label,
        intensity: 7,
        tags: [],
        reflection: '',
      });
    } catch (e) {
      // Keep optimistic update
    }
  };

  const currentAffirmation = AFFIRMATIONS[quoteIdx];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header with Balanced Padding */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.microTagRow}>
            <View style={styles.microDot} />
            <Text style={styles.microTagText}>MINDFUL SANCTUARY</Text>
          </View>
          <Text style={styles.greetingTitle}>
            {greeting}, <Text style={styles.greetingName}>{userName}</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.settingsIconBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.75}
            accessibilityLabel="Sanctuary Settings"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="settings-outline" size={18} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
            accessibilityLabel="My Profile"
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Full-Screen Content Container with Consistent Gaps */}
        <View style={styles.cardsContainer}>
          {/* 1. Compact Daily Intention Card */}
          <View style={[styles.quoteCard, { backgroundColor: currentAffirmation.bg, borderColor: currentAffirmation.border }]}>
            <View style={styles.quoteTopRow}>
              <View style={styles.quoteTag}>
                <Ionicons name="sparkles" size={10} color={currentAffirmation.accent} />
                <Text style={[styles.quoteTagText, { color: currentAffirmation.accent }]}>DAILY INTENTION</Text>
              </View>
              <TouchableOpacity
                onPress={nextQuote}
                style={styles.quoteShuffleBtn}
                activeOpacity={0.6}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="shuffle-outline" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.quoteText}>"{currentAffirmation.quote}"</Text>
            <Text style={styles.quoteAuthor}>— {currentAffirmation.author}</Text>
          </View>

          {/* 2. Compact 1-Tap Mood Check-In Card */}
          <View style={styles.moodCard}>
            <View style={styles.moodCardHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.moodCardTitle}>How is your mind feeling right now?</Text>
                <Text style={styles.moodCardSub}>
                  {moodFeedback ? (
                    <Text style={{ color: '#059669', fontWeight: '600' }}>✓ {moodFeedback} · Be gentle with yourself</Text>
                  ) : (
                    'Tap one feeling to check in'
                  )}
                </Text>
              </View>

              {/* History Button to MoodCheckinScreen */}
              <TouchableOpacity
                style={styles.historyBtn}
                onPress={() => navigation.navigate('MoodCheckin')}
                activeOpacity={0.75}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="time-outline" size={13} color="#059669" />
                <Text style={styles.historyBtnText}>History</Text>
                <Ionicons name="chevron-forward" size={11} color="#059669" />
              </TouchableOpacity>
            </View>

            <View style={styles.moodRow}>
              {QUICK_MOODS.map((m) => {
                const isSelected = latestMood?.mood_id === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.moodPill,
                      isSelected && {
                        backgroundColor: m.bg,
                        borderColor: m.color,
                        borderWidth: 1.5,
                      },
                    ]}
                    onPress={() => handleSelectMood(m)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        isSelected && { color: m.color, fontWeight: '700' },
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick Link to Full Check-in & History */}
            <TouchableOpacity
              style={styles.moodCardFooter}
              onPress={() => navigation.navigate('MoodCheckin')}
              activeOpacity={0.7}
            >
              <Text style={styles.moodCardFooterText}>View Full Mood History & Reflections</Text>
              <Ionicons name="arrow-forward" size={12} color="#059669" />
            </TouchableOpacity>
          </View>

          {/* 3. Mindful Breath Pause Card (Full-width, perfectly proportioned) */}
          <TouchableOpacity
            style={styles.pauseCard}
            onPress={() => navigation.navigate('Activities')}
            activeOpacity={0.85}
          >
            <View style={styles.pauseIconBox}>
              <Ionicons name="leaf" size={17} color="#059669" />
            </View>

            <View style={styles.pauseTextArea}>
              <Text style={styles.pauseTitle}>3-Min Mindful Breath</Text>
              <Text style={styles.pauseSub}>Gentle 4-7-8 rhythm to ground your focus</Text>
            </View>

            <View style={styles.pauseBtn}>
              <Ionicons name="play" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.pauseBtnText}>Start</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. Bottom Grounding Note positioned naturally at base */}
        <View style={styles.footerNoteArea}>
          <Ionicons name="sparkles-outline" size={12} color="#94A3B8" style={{ marginBottom: 4 }} />
          <Text style={styles.footerNoteText}>
            "Your mind is a quiet garden. Take it one gentle breath at a time."
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

  /* 1. Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surfaceBase,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flex: 1,
  },
  microTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  microDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  microTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  greetingTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.headlineSm,
    color: colors.textMain,
    letterSpacing: -0.3,
  },
  greetingName: {
    color: colors.primary,
  },
  greetingSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.level1,
  },
  avatarBtn: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSubtle,
  },

  /* Scroll Content: Full-screen height distribution */
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  /* Cards Container with well-maintained gaps */
  cardsContainer: {
    gap: spacing.lg,
  },

  /* 2. Quote Card */
  quoteCard: {
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    ...shadows.level1,
  },
  quoteTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quoteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quoteTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  quoteShuffleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  quoteAuthor: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
  },

  /* 3. Mood Card */
  moodCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.level1,
  },
  moodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  moodCardTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
  },
  moodCardSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
    marginTop: 2,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  moodPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 64,
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    gap: 3,
    minHeight: 32,
  },
  historyBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: colors.primary,
  },
  moodCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceHover,
    gap: 4,
    minHeight: 36,
  },
  moodCardFooterText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.primary,
  },

  /* 4. Mindful Breath Pause Card */
  pauseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    ...shadows.level1,
  },
  pauseIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseTextArea: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  pauseTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
  },
  pauseSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
    marginTop: 2,
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    ...shadows.level3,
    minHeight: 34,
  },
  pauseBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },

  /* 5. Footer Gentle Grounding Note */
  footerNoteArea: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNoteText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 16,
  },
});

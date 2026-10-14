import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { moodApi, journalApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// =============================================================
// COLORFUL DAILY AFFIRMATIONS
// =============================================================
const AFFIRMATIONS = [
  {
    quote: "Quiet the mind, and the soul will gently speak.",
    author: "Ma Jaya Sati Bhagavati",
    sub: "You have enough, you do enough, you are enough.",
    accent: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    tag: 'Daily Presence'
  },
  {
    quote: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
    sub: "Each slow breath creates space for peace.",
    accent: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    tag: 'Inner Strength'
  },
  {
    quote: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
    sub: "Honor your emotions without being consumed by them.",
    accent: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    tag: 'Mindful Anchor'
  },
  {
    quote: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    sub: "Give yourself permission to pause and reset.",
    accent: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    tag: 'Rest & Renewal'
  }
];

// Quick Mood Check-In Selector Options
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
  const [recentJournal, setRecentJournal] = useState(null);
  const [journalCount, setJournalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = user?.name ? user.name.split(' ')[0] : 'Sarah';

  const loadDashboard = async () => {
    try {
      const [moodRes, journalRes] = await Promise.allSettled([
        moodApi.getMoodHistory(1),
        journalApi.getEntries(),
      ]);

      if (moodRes.status === 'fulfilled' && moodRes.value && moodRes.value.data && moodRes.value.data.length > 0) {
        setLatestMood(moodRes.value.data[0]);
      }
      if (journalRes.status === 'fulfilled' && journalRes.value && journalRes.value.data) {
        const list = journalRes.value.data;
        setJournalCount(list.length);
        if (list.length > 0) {
          setRecentJournal(list[0]);
        }
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

  const currentAffirmation = AFFIRMATIONS[quoteIdx];

  // Calculate daily rituals completed
  const ritualsCompleted = (latestMood ? 1 : 0) + (journalCount > 0 ? 1 : 0) + 1; // 1 for visiting

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ========================================================= */}
      {/* 1. TOP SANCTUARY HEADER                                   */}
      {/* ========================================================= */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.welcomePill}>
            <Ionicons name="sparkles" size={11} color="#059669" />
            <Text style={styles.welcomePillText}>MINDFUL SANCTUARY</Text>
          </View>
          <Text style={styles.greetingTitle}>
            {greeting}, <Text style={styles.greetingName}>{userName}</Text>
          </Text>
          <Text style={styles.dateSubtitle}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Streak Flame Badge */}
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={14} color="#D97706" />
            <Text style={styles.streakText}>4 Days</Text>
          </View>

          {/* User Profile Avatar */}
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' }}
              style={styles.avatarImage}
            />
            <View style={styles.avatarDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* ========================================================= */}
        {/* 2. COLORFUL DAILY AFFIRMATION HERO CARD                   */}
        {/* ========================================================= */}
        <View style={[styles.affirmationCard, { backgroundColor: currentAffirmation.bg, borderColor: currentAffirmation.border }]}>
          <View style={styles.affirmationTopRow}>
            <View style={[styles.affirmationBadge, { backgroundColor: '#FFFFFF', borderColor: currentAffirmation.border }]}>
              <Ionicons name="sunny" size={12} color={currentAffirmation.accent} />
              <Text style={[styles.affirmationBadgeText, { color: currentAffirmation.accent }]}>
                {currentAffirmation.tag}
              </Text>
            </View>

            <TouchableOpacity onPress={nextQuote} style={styles.refreshAffirmationBtn} activeOpacity={0.7}>
              <Ionicons name="refresh" size={14} color={currentAffirmation.accent} />
              <Text style={[styles.refreshAffirmationText, { color: currentAffirmation.accent }]}>New Spark</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.affirmationQuote}>"{currentAffirmation.quote}"</Text>
          <Text style={styles.affirmationAuthor}>— {currentAffirmation.author}</Text>
          <Text style={styles.affirmationSub}>{currentAffirmation.sub}</Text>
        </View>

        {/* ========================================================= */}
        {/* 3. INTERACTIVE EMOTIONAL CHECK-IN PULSE                  */}
        {/* ========================================================= */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.widgetIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="heart" size={16} color="#059669" />
              </View>
              <View>
                <Text style={styles.widgetTitle}>How are you feeling right now?</Text>
                <Text style={styles.widgetSubtitle}>
                  {latestMood
                    ? `Logged: ${latestMood.mood_label} (${latestMood.intensity}/10 intensity)`
                    : 'Tap a feeling to record your presence'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('MoodCheckin')}>
              <Text style={styles.viewHistoryLink}>History</Text>
            </TouchableOpacity>
          </View>

          {/* 5 Quick Mood Selection Pills */}
          <View style={styles.quickMoodRow}>
            {QUICK_MOODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.quickMoodPill,
                  { backgroundColor: m.bg, borderColor: m.border },
                  latestMood?.mood_id === m.id && { borderWidth: 2, borderColor: m.color }
                ]}
                onPress={() => navigation.navigate('MoodCheckin')}
                activeOpacity={0.75}
              >
                <Text style={styles.quickMoodEmoji}>{m.emoji}</Text>
                <Text style={[styles.quickMoodLabel, { color: m.color }]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.checkinFullBtn}
            onPress={() => navigation.navigate('MoodCheckin')}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles-outline" size={15} color="#FFFFFF" />
            <Text style={styles.checkinFullBtnText}>
              {latestMood ? "Update Detailed Check-in" : "Begin Guided Check-in"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* 4. MAYA AI COMPANION QUICK HERO                           */}
        {/* ========================================================= */}
        <View style={styles.mayaCard}>
          <View style={styles.mayaTopRow}>
            <View style={styles.mayaAvatarWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop' }}
                style={styles.mayaAvatar}
              />
              <View style={styles.mayaActiveDot} />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.mayaName}>Maya</Text>
                <View style={styles.mayaBadge}>
                  <Text style={styles.mayaBadgeText}>✦ AI Companion</Text>
                </View>
              </View>
              <Text style={styles.mayaSubtitle}>Listening with empathy & warmth</Text>
            </View>
          </View>

          <View style={styles.mayaSpeechBubble}>
            <Text style={styles.mayaSpeechText}>
              "Take a gentle pause right here. You don't have to carry your to-do list alone today. I'm right here whenever you need a safe space to decompress."
            </Text>
          </View>

          <View style={styles.mayaActionRow}>
            <TouchableOpacity
              style={styles.mayaChatBtn}
              onPress={() => navigation.navigate('Chat')}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
              <Text style={styles.mayaChatBtnText}>Speak with Maya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mayaSighBtn}
              onPress={() => navigation.navigate('Activities')}
              activeOpacity={0.75}
            >
              <Ionicons name="color-filter-outline" size={16} color="#059669" />
              <Text style={styles.mayaSighBtnText}>2-Min Breathwork</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 5. DAILY MINDFUL RITUALS (PROGRESS TRACKER)               */}
        {/* ========================================================= */}
        <View style={styles.ritualsCard}>
          <View style={styles.ritualsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.widgetIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="ribbon" size={16} color="#D97706" />
              </View>
              <Text style={styles.widgetTitle}>Daily Mindful Rituals</Text>
            </View>
            <View style={styles.ritualsCountPill}>
              <Text style={styles.ritualsCountText}>{ritualsCompleted} of 3 Done</Text>
            </View>
          </View>

          <View style={styles.ritualItemRow}>
            <View style={[styles.ritualCheckCircle, latestMood && styles.ritualCheckCircleDone]}>
              <Ionicons name={latestMood ? "checkmark" : "ellipse-outline"} size={14} color={latestMood ? "#FFFFFF" : "#94A3B8"} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.ritualTitle, latestMood && styles.ritualTitleDone]}>Morning Emotional Check-in</Text>
              <Text style={styles.ritualSub}>{latestMood ? `Completed (${latestMood.mood_label})` : 'Acknowledge your emotional weather'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.ritualActionBtn, latestMood && { backgroundColor: '#F1F5F9' }]}
              onPress={() => navigation.navigate('MoodCheckin')}
            >
              <Text style={[styles.ritualActionText, latestMood && { color: colors.textMuted }]}>
                {latestMood ? "Review" : "Start"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ritualDivider} />

          <View style={styles.ritualItemRow}>
            <View style={[styles.ritualCheckCircle, styles.ritualCheckCircleDone]}>
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.ritualTitle, styles.ritualTitleDone]}>4-7-8 Breathwork Calibration</Text>
              <Text style={styles.ritualSub}>5 minutes · Vagus nerve reset</Text>
            </View>
            <TouchableOpacity
              style={styles.ritualActionBtn}
              onPress={() => navigation.navigate('Activities')}
            >
              <Text style={styles.ritualActionText}>Practice</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ritualDivider} />

          <View style={styles.ritualItemRow}>
            <View style={[styles.ritualCheckCircle, journalCount > 0 && styles.ritualCheckCircleDone]}>
              <Ionicons name={journalCount > 0 ? "checkmark" : "ellipse-outline"} size={14} color={journalCount > 0 ? "#FFFFFF" : "#94A3B8"} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.ritualTitle, journalCount > 0 && styles.ritualTitleDone]}>Evening Journal Reflection</Text>
              <Text style={styles.ritualSub}>{journalCount > 0 ? `${journalCount} thoughts recorded` : 'Unburden what feels heavy'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.ritualActionBtn, journalCount > 0 && { backgroundColor: '#F1F5F9' }]}
              onPress={() => navigation.navigate('Journal')}
            >
              <Text style={[styles.ritualActionText, journalCount > 0 && { color: colors.textMuted }]}>
                {journalCount > 0 ? "View" : "Write"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 6. RECOMMENDED BREATHWORK & CALMING PRACTICES             */}
        {/* ========================================================= */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="leaf" size={16} color="#059669" />
            <Text style={styles.sectionTitle}>Calming Practices</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
            <Text style={styles.seeAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.practicesScroll}
          contentContainerStyle={{ paddingHorizontal: spacing.gutter, gap: 12 }}
        >
          {/* Card 1: 4-7-8 Deep Calm Breathing */}
          <TouchableOpacity
            style={[styles.practiceCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}
            onPress={() => navigation.navigate('Activities')}
            activeOpacity={0.85}
          >
            <View style={styles.practiceImageWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=350&auto=format&fit=crop' }}
                style={styles.practiceImage}
              />
              <View style={styles.practiceBadgeTop}>
                <Text style={styles.practiceBadgeText}>5 MIN · VAGUS TONE</Text>
              </View>
            </View>

            <Text style={styles.practiceTitle}>4-7-8 Relaxing Breath</Text>
            <Text style={styles.practiceDesc} numberOfLines={2}>
              Lengthens exhalations to quickly soothe your nervous system and slow rapid heartbeat.
            </Text>

            <View style={styles.practiceFooter}>
              <View style={[styles.practicePlayBtn, { backgroundColor: '#059669' }]}>
                <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
              <Text style={[styles.practicePlayText, { color: '#059669' }]}>Begin Practice</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Box Breathing */}
          <TouchableOpacity
            style={[styles.practiceCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
            onPress={() => navigation.navigate('Activities')}
            activeOpacity={0.85}
          >
            <View style={styles.practiceImageWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=350&auto=format&fit=crop' }}
                style={styles.practiceImage}
              />
              <View style={[styles.practiceBadgeTop, { backgroundColor: '#2563EB' }]}>
                <Text style={styles.practiceBadgeText}>4 MIN · FOCUS RESET</Text>
              </View>
            </View>

            <Text style={styles.practiceTitle}>Box Breathing Technique</Text>
            <Text style={styles.practiceDesc} numberOfLines={2}>
              Equal-ratio four-part rhythm used by performers to regain instant calm and sharp focus.
            </Text>

            <View style={styles.practiceFooter}>
              <View style={[styles.practicePlayBtn, { backgroundColor: '#2563EB' }]}>
                <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
              <Text style={[styles.practicePlayText, { color: '#2563EB' }]}>Begin Practice</Text>
            </View>
          </TouchableOpacity>

          {/* Card 3: Deep Rest & Body Scan */}
          <TouchableOpacity
            style={[styles.practiceCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}
            onPress={() => navigation.navigate('Activities')}
            activeOpacity={0.85}
          >
            <View style={styles.practiceImageWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=350&auto=format&fit=crop' }}
                style={styles.practiceImage}
              />
              <View style={[styles.practiceBadgeTop, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.practiceBadgeText}>10 MIN · BODY SCAN</Text>
              </View>
            </View>

            <Text style={styles.practiceTitle}>Evening Somatic Release</Text>
            <Text style={styles.practiceDesc} numberOfLines={2}>
              Progressively releases stored stress from jaw, shoulders, and hips before restorative sleep.
            </Text>

            <View style={styles.practiceFooter}>
              <View style={[styles.practicePlayBtn, { backgroundColor: '#7C3AED' }]}>
                <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
              <Text style={[styles.practicePlayText, { color: '#7C3AED' }]}>Begin Practice</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* ========================================================= */}
        {/* 7. PRIVATE JOURNAL SNIPPET WIDGET                         */}
        {/* ========================================================= */}
        <View style={styles.journalWidgetCard}>
          <View style={styles.journalWidgetHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.widgetIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="book" size={16} color="#D97706" />
              </View>
              <View>
                <Text style={styles.widgetTitle}>Sanctuary Journal</Text>
                <Text style={styles.widgetSubtitle}>
                  {journalCount > 0 ? `${journalCount} mindful reflections saved` : 'Private end-to-end safe container'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Journal')}>
              <Text style={styles.viewHistoryLink}>Open All</Text>
            </TouchableOpacity>
          </View>

          {recentJournal ? (
            <TouchableOpacity
              style={styles.recentJournalBox}
              onPress={() => navigation.navigate('Journal')}
              activeOpacity={0.8}
            >
              <View style={styles.recentJournalTop}>
                <Text style={styles.recentJournalDate}>
                  {new Date(recentJournal.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
                <View style={styles.recentJournalCategoryBadge}>
                  <Text style={styles.recentJournalCategoryText}>{recentJournal.category || 'Reflective'}</Text>
                </View>
              </View>
              <Text style={styles.recentJournalTitle} numberOfLines={1}>{recentJournal.title || 'Untitled'}</Text>
              <Text style={styles.recentJournalExcerpt} numberOfLines={2}>{recentJournal.content}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyJournalBox}>
              <Text style={styles.emptyJournalText}>
                "Your mind is a quiet garden. Plant a peaceful thought today."
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.journalWriteBtn}
            onPress={() => navigation.navigate('Journal')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color="#059669" />
            <Text style={styles.journalWriteBtnText}>Write Today's Reflection</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* 8. CRISIS SUPPORT CARD                                    */}
        {/* ========================================================= */}
        <View style={styles.crisisCard}>
          <View style={styles.crisisHeader}>
            <View style={styles.crisisIconCircle}>
              <Ionicons name="shield-checkmark" size={16} color="#DC2626" />
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
            <Ionicons name="call" size={14} color="#FFFFFF" />
            <Text style={styles.crisisBtnText}>Access Crisis Support Line</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================================
// MODERN MINDFUL DASHBOARD STYLES
// =============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },

  /* --- 1. HEADER --- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 154, 139, 0.12)',
  },
  headerLeft: {
    flex: 1,
  },
  welcomePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 4,
    marginBottom: 2,
  },
  welcomePillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#059669',
    letterSpacing: 0.8,
  },
  greetingTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 22,
    color: colors.textMain,
  },
  greetingName: {
    color: '#059669',
  },
  dateSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  streakText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#D97706',
  },
  avatarBtn: {
    position: 'relative',
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E2E8F0',
  },
  avatarDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  /* --- 2. AFFIRMATION HERO CARD --- */
  affirmationCard: {
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: spacing.md,
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  affirmationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  affirmationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  affirmationBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
    letterSpacing: 0.4,
  },
  refreshAffirmationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshAffirmationText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
  },
  affirmationQuote: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 16.5,
    color: colors.textMain,
    lineHeight: 24,
    marginBottom: 4,
  },
  affirmationAuthor: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
    color: colors.textMuted,
    marginBottom: 6,
  },
  affirmationSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12.5,
    color: '#475569',
    fontStyle: 'italic',
  },

  /* --- 3. EMOTIONAL CHECK-IN CARD --- */
  widgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    marginBottom: spacing.md,
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  widgetIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 16,
    color: colors.textMain,
  },
  widgetSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  viewHistoryLink: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#059669',
  },
  quickMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 6,
  },
  quickMoodPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  quickMoodEmoji: {
    fontSize: 20,
    marginBottom: 3,
  },
  quickMoodLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
  },
  checkinFullBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 11,
    borderRadius: radius.pill,
    gap: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  checkinFullBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },

  /* --- 4. MAYA AI HERO CARD --- */
  mayaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    marginBottom: spacing.md,
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  mayaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mayaAvatarWrapper: {
    position: 'relative',
  },
  mayaAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  mayaActiveDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mayaName: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 17,
    color: colors.textMain,
  },
  mayaBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  mayaBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#059669',
  },
  mayaSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  mayaSpeechBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    marginBottom: 12,
  },
  mayaSpeechText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  mayaActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mayaChatBtn: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: radius.pill,
    gap: 6,
  },
  mayaChatBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  mayaSighBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 10,
    borderRadius: radius.pill,
    gap: 5,
  },
  mayaSighBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#059669',
  },

  /* --- 5. RITUALS TRACKER --- */
  ritualsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    marginBottom: spacing.md,
  },
  ritualsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  ritualsCountPill: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ritualsCountText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#D97706',
  },
  ritualItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ritualCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ritualCheckCircleDone: {
    backgroundColor: '#10B981',
  },
  ritualTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: colors.textMain,
  },
  ritualTitleDone: {
    color: '#059669',
  },
  ritualSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  ritualActionBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  ritualActionText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
    color: '#059669',
  },
  ritualDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },

  /* --- 6. PRACTICES CAROUSEL --- */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 18,
    color: colors.textMain,
  },
  seeAllLink: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#059669',
  },
  practicesScroll: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    marginHorizontal: -spacing.gutter,
  },
  practiceCard: {
    width: 250,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  practiceImageWrapper: {
    width: '100%',
    height: 110,
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  practiceImage: {
    width: '100%',
    height: '100%',
  },
  practiceBadgeTop: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  practiceBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9.5,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  practiceTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 15.5,
    color: colors.textMain,
    marginBottom: 4,
  },
  practiceDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  practiceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  practicePlayBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  practicePlayText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
  },

  /* --- 7. JOURNAL WIDGET --- */
  journalWidgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    marginBottom: spacing.md,
  },
  journalWidgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentJournalBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
    marginBottom: 12,
  },
  recentJournalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentJournalDate: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
  recentJournalCategoryBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  recentJournalCategoryText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9.5,
    color: '#D97706',
  },
  recentJournalTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 14.5,
    color: colors.textMain,
    marginBottom: 2,
  },
  recentJournalExcerpt: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  emptyJournalBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyJournalText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12.5,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  journalWriteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 10,
    borderRadius: radius.pill,
    gap: 6,
  },
  journalWriteBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#059669',
  },

  /* --- 8. CRISIS SUPPORT CARD --- */
  crisisCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  crisisIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crisisTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13.5,
    color: '#E11D48',
    marginBottom: 2,
  },
  crisisSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  crisisBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E11D48',
    paddingVertical: 9,
    borderRadius: radius.pill,
    gap: 6,
  },
  crisisBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
});

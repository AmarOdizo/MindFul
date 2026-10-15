import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { moodApi } from '../services/api';

// 5 Colorful Emotional Moods with Tailored Palettes
const MOODS = [
  {
    id: 'happy',
    label: 'Happy',
    sub: 'Joyful & Upbeat',
    emoji: '😊',
    cardBg: '#FFFBEB',
    accent: '#D97706',
    border: '#FCD34D',
    glow: '#FEF3C7',
    icon: 'sunny',
  },
  {
    id: 'calm',
    label: 'Calm',
    sub: 'Peaceful & Centered',
    emoji: '😌',
    cardBg: '#ECFDF5',
    accent: '#059669',
    border: '#A7F3D0',
    glow: '#D1FAE5',
    icon: 'leaf',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    sub: 'Steady & Balanced',
    emoji: '😐',
    cardBg: '#F0F5FF',
    accent: '#4F46E5',
    border: '#C7D2FE',
    glow: '#E0E7FF',
    icon: 'remove-circle',
  },
  {
    id: 'sad',
    label: 'Sad',
    sub: 'Low & Tender',
    emoji: '😔',
    cardBg: '#EFF6FF',
    accent: '#2563EB',
    border: '#BFDBFE',
    glow: '#DBEAFE',
    icon: 'rainy',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    sub: 'Stressed & Restless',
    emoji: '😰',
    cardBg: '#FAF5FF',
    accent: '#9333EA',
    border: '#E9D5FF',
    glow: '#F3E8FF',
    icon: 'pulse',
  },
];

// Rich Volume Descriptions
const VOLUME_DESCRIPTORS = {
  1: { title: 'Quiet Whisper', sub: 'Faint, subtle feeling lingering softly', icon: 'volume-low', color: '#10B981' },
  2: { title: 'Soft Hum', sub: 'Gentle vibration, calm and manageable', icon: 'volume-low', color: '#10B981' },
  3: { title: 'Mild Presence', sub: 'Audible melody, easy to hold space for', icon: 'volume-low', color: '#059669' },
  4: { title: 'Steady Rhythm', sub: 'Noticeable presence without overwhelming', icon: 'volume-medium', color: '#0284C7' },
  5: { title: 'Clear & Balanced', sub: 'Right in the center of conscious awareness', icon: 'volume-medium', color: '#2563EB' },
  6: { title: 'Pronounced Beat', sub: 'Taking distinct space in mind and body', icon: 'volume-medium', color: '#4F46E5' },
  7: { title: 'Strong Resonance', sub: 'Vibrant, active, and distinctly felt', icon: 'volume-medium', color: '#7C3AED' },
  8: { title: 'Surging Wave', sub: 'Deeply pervasive throughout your thoughts', icon: 'volume-high', color: '#D97706' },
  9: { title: 'Heavy Crescendo', sub: 'Intense tide calling for gentle breath', icon: 'volume-high', color: '#EA580C' },
  10: { title: 'Consuming Peak', sub: 'Maximum volume, completely enveloping', icon: 'volume-high', color: '#DC2626' },
};

// Helpful Quick Reflection Inspiration Prompts
const QUICK_PROMPTS = [
  '☕ Quiet morning tea',
  '🌿 Fresh walk in nature',
  '💬 Uplifting chat with friend',
  '💼 Workplace deadlines',
  '😴 Restful sleep & dreams',
  '🧘 Mindful deep breathing',
];

export default function MoodCheckinScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState('calm');
  const [intensity, setIntensity] = useState(6);
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Active theme color scheme derived from selected emotion
  const activeMood = useMemo(() => {
    return MOODS.find((m) => m.id === selectedMood) || MOODS[1];
  }, [selectedMood]);

  // Volume helper functions
  const decreaseIntensity = () => {
    setIntensity((prev) => Math.max(1, prev - 1));
  };

  const increaseIntensity = () => {
    setIntensity((prev) => Math.min(10, prev + 1));
  };

  const appendPrompt = (promptText) => {
    if (!reflection) {
      setReflection(promptText);
    } else {
      setReflection(`${reflection}, ${promptText}`);
    }
  };

  useEffect(() => {
    loadWeeklyHistory();
  }, []);

  const loadWeeklyHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await moodApi.getMoodHistory(14);
      if (res && res.data) {
        setWeeklyLogs(res.data);
      }
    } catch (e) {
      console.warn('Could not load weekly mood logs:', e.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Past 7 Days calculation for weekly strip
  const past7Days = useMemo(() => {
    const list = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const matchedLog = weeklyLogs.find((log) => {
        if (!log.created_at) return false;
        return log.created_at.startsWith(dateKey);
      });

      list.push({
        dateKey,
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        isToday: i === 0,
        log: matchedLog,
      });
    }
    return list;
  }, [weeklyLogs]);

  const getLogEmoji = (log) => {
    if (!log) return null;
    const moodItem = MOODS.find(
      (m) => m.id === log.mood_id || m.label.toLowerCase() === (log.mood_label || '').toLowerCase()
    );
    if (moodItem) return moodItem.emoji;
    const label = (log.mood_label || log.mood_id || '').toLowerCase();
    if (label.includes('happy') || label.includes('radiant')) return '😊';
    if (label.includes('calm')) return '😌';
    if (label.includes('neutral')) return '😐';
    if (label.includes('sad') || label.includes('heavy')) return '😔';
    if (label.includes('anxious') || label.includes('restless')) return '😰';
    return '🌱';
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      if (isToday) return `Today, ${timeStr}`;
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
    } catch {
      return '';
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const moodObj = MOODS.find((m) => m.id === selectedMood) || { label: 'Calm' };
      await moodApi.logMood({
        mood_id: selectedMood,
        mood_label: moodObj.label,
        intensity: intensity,
        tags: [],
        reflection: reflection.trim(),
      });
      await loadWeeklyHistory();
      navigation.goBack();
    } catch (err) {
      console.warn('Mood save notice:', err.message);
      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  const currentDesc = VOLUME_DESCRIPTORS[intensity] || VOLUME_DESCRIPTORS[6];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Header Navigation */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Check-in</Text>
        <View style={styles.livePulseBadge}>
          <View style={[styles.pulseDot, { backgroundColor: activeMood.accent }]} />
          <Text style={[styles.pulseText, { color: activeMood.accent }]}>Active</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Dynamic Atmospheric Banner */}
        <View style={[styles.bannerCard, { backgroundColor: activeMood.cardBg, borderColor: activeMood.border }]}>
          <View style={[styles.bannerAuraGlow, { backgroundColor: activeMood.glow }]} />
          <View style={styles.bannerTopRow}>
            <View style={[styles.bannerPill, { backgroundColor: '#FFFFFF' }]}>
              <Text style={{ fontSize: 16 }}>{activeMood.emoji}</Text>
              <Text style={[styles.bannerPillText, { color: activeMood.accent }]}>
                {activeMood.label.toUpperCase()} SANCTUARY
              </Text>
            </View>
            <View style={styles.calmIconBubble}>
              <Ionicons name={activeMood.icon} size={18} color={activeMood.accent} />
            </View>
          </View>
          <Text style={styles.bannerTitle}>Acknowledge your presence</Text>
          <Text style={styles.bannerSubtitle}>
            Every nuance of your internal weather is honored here without judgement.
          </Text>
        </View>

        {/* STEP 1: CHOOSE YOUR PRIMARY FEELING (5 COLORFUL EMOJIS) */}
        <View style={styles.sectionBlock}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Choose your primary feeling</Text>
              <Text style={styles.stepSub}>Tap the emoji that speaks to your heart</Text>
            </View>
          </View>

          {/* Horizontal Scroll with Responsive Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScrollContent}
          >
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodCard,
                    { backgroundColor: isSelected ? mood.cardBg : '#FFFFFF' },
                    isSelected && { borderColor: mood.accent, shadowColor: mood.accent },
                  ]}
                  onPress={() => setSelectedMood(mood.id)}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={`${mood.label}: ${mood.sub}`}
                >
                  {/* Selected Active Checkmark Pill */}
                  {isSelected && (
                    <View style={[styles.selectedCheckPill, { backgroundColor: mood.accent }]}>
                      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                    </View>
                  )}

                  {/* Circular Emoji Container with Soft Tint */}
                  <View
                    style={[
                      styles.emojiCircleBox,
                      { backgroundColor: isSelected ? mood.glow : '#F8F9FD' },
                    ]}
                  >
                    <Text style={styles.emojiDisplay}>{mood.emoji}</Text>
                  </View>

                  <Text
                    style={[
                      styles.moodNameText,
                      isSelected && { color: mood.accent, fontFamily: typography.fontFamily.sansBold },
                    ]}
                  >
                    {mood.label}
                  </Text>
                  <Text style={styles.moodSubText} numberOfLines={1}>
                    {mood.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* STEP 2: VOLUME EQUALIZER & INTENSITY CONTROLLER */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>How intense does this feel?</Text>
              <Text style={styles.stepSub}>Tune the volume of your emotional frequency</Text>
            </View>
            {/* Dynamic Volume % Badge */}
            <View style={[styles.volumeBadgePill, { backgroundColor: activeMood.glow }]}>
              <Ionicons name={currentDesc.icon} size={15} color={activeMood.accent} />
              <Text style={[styles.volumeBadgeText, { color: activeMood.accent }]}>
                {intensity * 10}%
              </Text>
            </View>
          </View>

          {/* Stepper with 10 Equalizer Level Bars */}
          <View style={styles.volumeControllerRow}>
            {/* Decrease Button (-) */}
            <TouchableOpacity
              style={[styles.stepperBtn, intensity <= 1 && styles.stepperBtnDisabled]}
              onPress={decreaseIntensity}
              disabled={intensity <= 1}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Decrease intensity"
            >
              <Ionicons name="remove" size={22} color={intensity <= 1 ? colors.textMuted : colors.textMain} />
            </TouchableOpacity>

            {/* 10 Interactive Waveform Equalizer Bars */}
            <View style={styles.equalizerTrack}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isActive = num <= intensity;
                const barHeight = 14 + num * 3.6;
                return (
                  <TouchableOpacity
                    key={num}
                    style={styles.equalizerCol}
                    onPress={() => setIntensity(num)}
                    activeOpacity={0.65}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                    accessibilityLabel={`Intensity level ${num}`}
                  >
                    <View
                      style={[
                        styles.equalizerBar,
                        { height: barHeight },
                        isActive
                          ? { backgroundColor: activeMood.accent }
                          : styles.equalizerBarInactive,
                      ]}
                    />
                    <Text
                      style={[
                        styles.equalizerNumText,
                        isActive && { color: activeMood.accent, fontFamily: typography.fontFamily.sansBold },
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Increase Button (+) */}
            <TouchableOpacity
              style={[styles.stepperBtn, intensity >= 10 && styles.stepperBtnDisabled]}
              onPress={increaseIntensity}
              disabled={intensity >= 10}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Increase intensity"
            >
              <Ionicons name="add" size={22} color={intensity >= 10 ? colors.textMuted : colors.textMain} />
            </TouchableOpacity>
          </View>

          {/* Continuous Volume Fill Slider Track */}
          <View style={styles.volumeSliderTrack}>
            <View
              style={[
                styles.volumeSliderProgress,
                { width: `${(intensity / 10) * 100}%`, backgroundColor: activeMood.accent },
              ]}
            />
            <View
              style={[
                styles.volumeSliderThumb,
                {
                  left: `${Math.max(3, Math.min(97, (intensity / 10) * 100))}%`,
                  borderColor: activeMood.accent,
                },
              ]}
            />
          </View>

          <View style={styles.volumeLabelsRow}>
            <Text style={styles.volumeLabelMuted}>🔈 Whisper</Text>
            <Text style={[styles.volumeLabelActive, { color: activeMood.accent }]}>
              Level {intensity} / 10
            </Text>
            <Text style={styles.volumeLabelMuted}>Surge 📢</Text>
          </View>

          {/* Emotional Insight Card */}
          <View style={[styles.volumeDescriptorCard, { backgroundColor: activeMood.cardBg }]}>
            <View style={[styles.volumeDescriptorIconBox, { backgroundColor: '#FFFFFF' }]}>
              <Ionicons name={currentDesc.icon} size={22} color={activeMood.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.volumeDescriptorTitle, { color: activeMood.accent }]}>
                {currentDesc.title}
              </Text>
              <Text style={styles.volumeDescriptorSub}>{currentDesc.sub}</Text>
            </View>
          </View>
        </View>

        {/* STEP 3: WEEKLY MOOD RHYTHM (RESPONSIVE 7-DAY CALENDAR & RECENT CHECK-INS) */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Weekly Mood Rhythm</Text>
              <Text style={styles.stepSub}>Your past 7 days emotional story</Text>
            </View>
            <TouchableOpacity
              onPress={loadWeeklyHistory}
              style={styles.refreshIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Refresh weekly history"
            >
              {isLoadingHistory ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="refresh" size={17} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Responsive 7-Day Calendar Strip - Fits all screens cleanly */}
          <View style={styles.calendarStripContainer}>
            {past7Days.map((dayItem) => {
              const emoji = getLogEmoji(dayItem.log);
              return (
                <View
                  key={dayItem.dateKey}
                  style={[
                    styles.dayPillColumn,
                    dayItem.isToday && styles.dayPillToday,
                    dayItem.log && styles.dayPillLogged,
                  ]}
                >
                  <Text style={[styles.dayAbbr, dayItem.isToday && styles.dayAbbrToday]}>
                    {dayItem.dayName}
                  </Text>
                  <Text style={[styles.dayNumber, dayItem.isToday && styles.dayNumberToday]}>
                    {dayItem.dayNumber}
                  </Text>

                  {/* Mood Bubble */}
                  <View
                    style={[
                      styles.dayMoodBubble,
                      dayItem.log && styles.dayMoodBubbleFilled,
                      dayItem.isToday && !dayItem.log && styles.dayMoodBubbleTodayEmpty,
                    ]}
                  >
                    {emoji ? (
                      <Text style={{ fontSize: 16 }}>{emoji}</Text>
                    ) : (
                      <View style={styles.emptyDayDot} />
                    )}
                  </View>

                  {dayItem.log ? (
                    <Text style={styles.miniIntensityText}>{dayItem.log.intensity}/10</Text>
                  ) : dayItem.isToday ? (
                    <View style={styles.todaySmallBadge}>
                      <Text style={styles.todaySmallBadgeText}>TODAY</Text>
                    </View>
                  ) : (
                    <Text style={styles.miniPlaceholderText}>-</Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Recent Check-ins History List */}
          <View style={styles.recentHistoryContainer}>
            <View style={styles.recentHeaderRow}>
              <Text style={styles.recentHeaderTitle}>Recent Check-ins</Text>
              <Text style={styles.recentCountBadge}>{weeklyLogs.length} logged</Text>
            </View>

            {weeklyLogs.length > 0 ? (
              weeklyLogs.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.recentCheckinCard}>
                  <View style={styles.recentEmojiBox}>
                    <Text style={{ fontSize: 24 }}>{getLogEmoji(item)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.recentCardTopRow}>
                      <Text style={styles.recentMoodTitle}>{item.mood_label || 'Mood'}</Text>
                      <View style={styles.recentScorePill}>
                        <Text style={styles.recentScoreText}>{item.intensity}/10</Text>
                      </View>
                    </View>
                    <Text style={styles.recentTimestamp}>{formatTime(item.created_at)}</Text>
                    {item.reflection ? (
                      <Text style={styles.recentReflectionText} numberOfLines={2}>
                        "{item.reflection}"
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyHistoryState}>
                <Ionicons name="sparkles-outline" size={26} color={colors.primary} />
                <Text style={styles.emptyHistoryText}>
                  Your 7-day emotional flow will flourish here as you record your daily feelings.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* STEP 4: REFLECTION & MICRO-JOURNAL WITH INSPIRATION CHIPS */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>4</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>What brought this feeling forward?</Text>
              <Text style={styles.stepSub}>Optional gentle micro-reflection</Text>
            </View>
          </View>

          {/* Quick Inspiring Chips */}
          <View style={styles.quickChipsWrapper}>
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                style={styles.promptChip}
                onPress={() => appendPrompt(prompt)}
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Text style={styles.promptChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.reflectionTextArea}
            placeholder="A quiet morning tea, a kind message, a challenging work session..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={reflection}
            onChangeText={setReflection}
            textAlignVertical="top"
          />
        </View>

        {/* STEP 5: SAVE TO SANCTUARY */}
        <View style={styles.saveActionArea}>
          <TouchableOpacity
            style={[styles.savePrimaryButton, isSaving && { opacity: 0.75 }]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Save mood to sanctuary"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.textInverse} style={{ marginRight: 8 }} />
            ) : (
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.textInverse}
              />
            )}
            <Text style={styles.savePrimaryButtonText}>
              {isSaving ? 'Holding Space...' : 'Save to My Sanctuary'}
            </Text>
          </TouchableOpacity>

          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
            <Text style={styles.securityNoteText}>
              100% Confidential • Protected by zero-knowledge architecture
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceBase,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm,
    color: colors.textMain,
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  pulseText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
  },
  scrollContainer: {
    paddingBottom: spacing.xl * 2,
  },

  /* Atmospheric Banner */
  bannerCard: {
    marginHorizontal: spacing.gutter,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  bannerAuraGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.6,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  bannerPillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    letterSpacing: 0.5,
  },
  calmIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
    marginTop: spacing.xs,
  },
  bannerSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 4,
  },

  /* Step Headers */
  sectionBlock: {
    marginBottom: spacing.lg,
  },
  sectionCard: {
    marginHorizontal: spacing.gutter,
    backgroundColor: '#FFFFFF',
    padding: spacing.md + 4,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.textInverse,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd + 1,
    color: colors.textMain,
  },
  stepSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginTop: 1,
  },

  /* Step 1: Mood Cards */
  moodScrollContent: {
    paddingHorizontal: spacing.gutter,
    gap: 12,
    paddingVertical: 4,
  },
  moodCard: {
    width: 110,
    height: 148,
    borderRadius: radius.lg,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  selectedCheckPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  emojiCircleBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  emojiDisplay: {
    fontSize: 32,
  },
  moodNameText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
    textAlign: 'center',
    marginTop: 2,
  },
  moodSubText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },

  /* Step 2: Volume Controller */
  volumeBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 4,
  },
  volumeBadgeText: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.labelSm,
  },
  volumeControllerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  stepperBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F3F4F9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperBtnDisabled: {
    opacity: 0.35,
  },
  equalizerTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    marginHorizontal: 10,
    paddingBottom: 2,
  },
  equalizerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  equalizerBar: {
    width: 7,
    borderRadius: 4,
    marginBottom: 4,
  },
  equalizerBarInactive: {
    backgroundColor: '#E4E7F0',
  },
  equalizerNumText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 9,
    color: colors.textMuted,
  },
  volumeSliderTrack: {
    height: 8,
    backgroundColor: '#EEF1F8',
    borderRadius: 4,
    position: 'relative',
    marginTop: 6,
    marginBottom: 6,
  },
  volumeSliderProgress: {
    height: '100%',
    borderRadius: 4,
  },
  volumeSliderThumb: {
    position: 'absolute',
    top: -4,
    marginLeft: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  volumeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  volumeLabelMuted: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  volumeLabelActive: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
  },
  volumeDescriptorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: 12,
    marginTop: spacing.md,
  },
  volumeDescriptorIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  volumeDescriptorTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
  },
  volumeDescriptorSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginTop: 1,
    lineHeight: 16,
  },

  /* Step 3: Calendar Strip & History */
  refreshIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
    borderRadius: radius.lg,
    padding: 8,
    marginVertical: spacing.xs,
  },
  dayPillColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: radius.md,
    marginHorizontal: 1.5,
  },
  dayPillToday: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  dayPillLogged: {
    backgroundColor: '#FFFFFF',
  },
  dayAbbr: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  dayAbbrToday: {
    color: colors.primary,
    fontFamily: typography.fontFamily.sansBold,
  },
  dayNumber: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMain,
    marginBottom: 4,
  },
  dayNumberToday: {
    color: colors.primary,
    fontFamily: typography.fontFamily.sansBold,
  },
  dayMoodBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF1F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayMoodBubbleFilled: {
    backgroundColor: '#FFFBEB',
  },
  dayMoodBubbleTodayEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  emptyDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    opacity: 0.4,
  },
  miniIntensityText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9,
    color: colors.primary,
    marginTop: 4,
  },
  todaySmallBadge: {
    marginTop: 4,
    backgroundColor: '#E8F3EE',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  todaySmallBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 7,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  miniPlaceholderText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
  },
  recentHistoryContainer: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
    paddingTop: spacing.md,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  recentHeaderTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodySm,
    color: colors.textMain,
  },
  recentCountBadge: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  recentCheckinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    borderRadius: radius.lg,
    padding: 10,
    marginBottom: 8,
  },
  recentEmojiBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentMoodTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodySm,
    color: colors.textMain,
  },
  recentScorePill: {
    backgroundColor: '#E8F3EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  recentScoreText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: '#065F46',
  },
  recentTimestamp: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginTop: 1,
  },
  recentReflectionText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyHistoryState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 6,
  },
  emptyHistoryText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },

  /* Step 4: Reflection */
  quickChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  promptChip: {
    backgroundColor: '#F3F4F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  promptChipText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMain,
  },
  reflectionTextArea: {
    backgroundColor: '#F8F9FD',
    borderRadius: radius.lg,
    padding: spacing.md,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMain,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#ECEEF5',
  },

  /* Step 5: Save Button */
  saveActionArea: {
    marginHorizontal: spacing.gutter,
    marginTop: spacing.xs,
  },
  savePrimaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: 14,
    borderRadius: radius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing.sm,
  },
  savePrimaryButtonText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: colors.textInverse,
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  securityNoteText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
});

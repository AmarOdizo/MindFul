import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

const MOODS = [
  { id: 'radiant', label: 'Radiant', sub: 'Joyful', icon: 'sunny', bg: '#F0DBFF', text: '#50405f' },
  { id: 'calm', label: 'Calm', sub: 'Peaceful', icon: 'water', bg: '#c8ead9', text: '#133126' },
  { id: 'neutral', label: 'Neutral', sub: 'Steady', icon: 'remove', bg: '#e3e7ff', text: '#414844' },
  { id: 'restless', label: 'Restless', sub: 'Anxious', icon: 'pulse', bg: '#edd8fe', text: '#6d5c7c' },
  { id: 'heavy', label: 'Heavy', sub: 'Low', icon: 'rainy', bg: '#f2f3ff', text: '#516449' }
];

const TAGS = ['Grateful', 'Centered', 'Relaxed', 'Scattered', 'Tired', 'Hopeful', 'Tense', 'Sensitive'];

const INTENSITY_LABELS = {
  1: "Very Gentle", 3: "Soft & Subtle", 5: "Present & Clear", 
  7: "Pronounced", 10: "Consuming Tide"
};

export default function MoodCheckinScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState('calm');
  const [intensity, setIntensity] = useState(6);
  const [selectedTags, setSelectedTags] = useState(['Centered', 'Relaxed']);
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Check-in</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerPill}>
            <Ionicons name="heart" size={16} color={colors.primary} />
            <Text style={styles.bannerPillText}>MINDFUL SANCTUARY</Text>
          </View>
          <Text style={styles.bannerTitle}>Daily Check-in</Text>
          <Text style={styles.bannerSub}>Pause and acknowledge where you are right now. Every feeling is welcome here.</Text>
        </View>

        {/* Step 1: Mood */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
            <Text style={styles.stepTitle}>Choose your primary weather</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll} contentContainerStyle={{ paddingHorizontal: spacing.gutter }}>
            {MOODS.map(mood => {
              const isSelected = selectedMood === mood.id;
              return (
                <TouchableOpacity 
                  key={mood.id}
                  style={[styles.moodCard, isSelected && styles.moodCardSelected, isSelected && { backgroundColor: mood.bg + '50' }]}
                  onPress={() => setSelectedMood(mood.id)}
                >
                  <View style={[styles.moodIconBox, { backgroundColor: isSelected ? mood.bg : '#F2F3FF' }]}>
                    <Ionicons name={mood.icon} size={24} color={isSelected ? mood.text : colors.textMuted} />
                  </View>
                  <View>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                    <Text style={styles.moodSub}>{mood.sub}</Text>
                  </View>
                  {isSelected && <View style={styles.moodIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Step 2: Intensity */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
              <Text style={styles.stepTitle}>How intense does this feel?</Text>
            </View>
            <View style={styles.intensityBadge}><Text style={styles.intensityBadgeText}>{intensity} / 10</Text></View>
          </View>
          
          <Text style={styles.intensityDescriptor}>
            {INTENSITY_LABELS[intensity] || INTENSITY_LABELS[intensity - 1] || "Mild & Pleasant"}
          </Text>

          <View style={styles.sliderRow}>
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <TouchableOpacity 
                key={num} 
                style={[styles.intensityTick, intensity === num && styles.intensityTickActive]}
                onPress={() => setIntensity(num)}
              >
                <Text style={[styles.intensityTickText, intensity === num && styles.intensityTickTextActive]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>Subtle whisper</Text>
            <Text style={styles.sliderLabelText}>Deeply pervasive</Text>
          </View>
        </View>

        {/* Step 3: Tags */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
            <Text style={styles.stepTitle}>Somatic & Emotion Tags</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {TAGS.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity 
                  key={tag}
                  style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  {isSelected && <Ionicons name="checkmark" size={14} color="#133126" style={{ marginRight: 4 }} />}
                  <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 4: Reflection */}
        <View style={styles.sectionCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>4</Text></View>
            <View>
              <Text style={styles.stepTitle}>What brought this feeling forward?</Text>
              <Text style={styles.stepSub}>Optional micro-reflection</Text>
            </View>
          </View>
          
          <TextInput
            style={styles.textArea}
            placeholder="A quiet morning tea, a kind text from a friend..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            value={reflection}
            onChangeText={setReflection}
            textAlignVertical="top"
          />
        </View>

        {/* Step 5: Save */}
        <View style={styles.saveSection}>
          <TouchableOpacity 
            style={[styles.saveBtn, isSaving && { opacity: 0.7 }]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Ionicons name={isSaving ? "sync" : "checkmark-circle"} size={24} color={colors.textInverse} />
            <Text style={styles.saveBtnText}>{isSaving ? "Holding Space..." : "Save to My Journey"}</Text>
          </TouchableOpacity>
          
          <View style={styles.privacyNote}>
            <Ionicons name="lock-closed" size={16} color={colors.tertiary} />
            <Text style={styles.privacyText}>Your check-ins are completely private to you and never shared.</Text>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyLg,
    color: colors.textMain,
  },
  container: {
    paddingBottom: spacing.xl * 2,
  },
  banner: {
    marginHorizontal: spacing.gutter,
    backgroundColor: '#F2F3FF',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c8ead960',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bannerPillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: '#2f4d40',
    marginLeft: 4,
  },
  bannerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  bannerSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMuted,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionCard: {
    marginHorizontal: spacing.gutter,
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginHorizontal: spacing.gutter,
  },
  stepBadge: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  stepBadgeText: {
    color: colors.textInverse,
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyLg,
    color: colors.textMain,
  },
  stepSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  moodScroll: {
    flexGrow: 0,
  },
  moodCard: {
    width: 120,
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    justifyContent: 'space-between',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodCardSelected: {
    borderColor: colors.primary,
  },
  moodIconBox: {
    width: 48, height: 48,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
  },
  moodSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  moodIndicator: {
    position: 'absolute',
    top: 10, right: 10,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  intensityBadge: {
    backgroundColor: '#F2F3FF',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.pill,
  },
  intensityBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  intensityDescriptor: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  intensityTick: {
    flex: 1,
    height: 36,
    marginHorizontal: 2,
    backgroundColor: '#F2F3FF',
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityTickActive: {
    backgroundColor: colors.primary,
  },
  intensityTickText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
  },
  intensityTickTextActive: {
    color: colors.textInverse,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F2F3FF',
    borderRadius: radius.pill,
  },
  tagChipSelected: {
    backgroundColor: '#EDD8FE',
  },
  tagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
  },
  tagTextSelected: {
    color: '#133126',
  },
  textArea: {
    backgroundColor: '#F2F3FF',
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
    minHeight: 100,
  },
  saveSection: {
    marginHorizontal: spacing.gutter,
    marginTop: spacing.sm,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyLg,
    color: colors.textInverse,
    marginLeft: 8,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  privacyText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginLeft: 6,
    textAlign: 'center',
  }
});

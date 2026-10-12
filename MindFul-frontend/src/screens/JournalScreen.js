import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';

const FILTERS = ['All Entries', 'Reflective', 'Peaceful', 'Grounded', 'Unburdening'];
const PROMPTS = [
  { id: '1', title: 'Body & Breath', icon: 'leaf', text: 'What is one thing your body is quietly asking for right now?', color: colors.secondary },
  { id: '2', title: 'Gratitude', icon: 'sunny', text: 'What went quietly well today that you can honor and celebrate?', color: colors.tertiary },
  { id: '3', title: 'Future Perspective', icon: 'mail', text: 'Write a compassionate, unhurried letter to your future self.', color: colors.primary },
];

export default function JournalScreen() {
  const [activeFilter, setActiveFilter] = useState('All Entries');
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerSubtitle}>MINDFUL AI</Text>
          <Text style={styles.headerTitle}>Journal</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Privacy Banner */}
        <View style={styles.privacyBanner}>
          <View style={styles.privacyIconBox}>
            <Ionicons name="lock-closed" size={18} color="#0f1f0b" />
          </View>
          <View style={styles.privacyTextContent}>
            <View style={styles.privacyRow}>
              <Text style={styles.privacyTitle}>Local & End-to-End Private</Text>
              <Ionicons name="shield-checkmark" size={16} color={colors.textMuted} />
            </View>
            <Text style={styles.privacyBody}>Your thoughts belong solely to you. AI reflection insights are processed locally.</Text>
          </View>
        </View>

        {/* Search & Write */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search thoughts, memories..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.writeBtn}>
            <Ionicons name="pencil" size={20} color={colors.textInverse} />
            <Text style={styles.writeBtnText}>Write</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={{ paddingHorizontal: spacing.gutter }}>
          {FILTERS.map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <View style={[styles.filterDot, { backgroundColor: activeFilter === f ? colors.primary : colors.textMuted }]} />
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gentle Sparks (Prompts) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="bulb-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Gentle Sparks</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Swipe for prompts</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsScroll} contentContainerStyle={{ paddingHorizontal: spacing.gutter }}>
          {PROMPTS.map(p => (
            <TouchableOpacity key={p.id} style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Ionicons name={p.icon} size={20} color={p.color} />
                <Text style={styles.promptHeaderTitle}>{p.title}</Text>
              </View>
              <Text style={styles.promptText}>"{p.text}"</Text>
              <View style={styles.promptFooter}>
                <Text style={styles.promptFooterText}>Reflect on this</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sanctuary Stream */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleStream}>Sanctuary Stream</Text>
          <Text style={styles.entryCountText}>2 Entries Recorded</Text>
        </View>

        {/* Entry 1 */}
        <View style={styles.entryCard}>
          <View style={styles.entryTopRow}>
            <View style={styles.entryDateBox}>
              <View style={styles.pulseDot} />
              <Text style={styles.entryDateText}>Today, Oct 24 · 9:15 AM</Text>
            </View>
            <View style={styles.pinnedBadge}>
              <Ionicons name="pin" size={12} color={colors.textMuted} />
              <Text style={styles.pinnedText}>Pinned</Text>
            </View>
          </View>
          
          <Text style={styles.entryTitle}>Finding quiet among the project storm</Text>
          <View style={styles.entryTag}>
            <Ionicons name="aperture-outline" size={14} color="#6d5c7c" />
            <Text style={styles.entryTagText}>Reflective & Grounding</Text>
          </View>
          
          <Text style={styles.entryBody}>
            Woke up with racing thoughts about the quarterly presentation. Maya suggested taking three physiological sighs before opening my inbox...
          </Text>
          
          <View style={styles.entryImageWrapper}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop' }}
              style={styles.entryImage}
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="partly-sunny" size={14} color="#FFF" />
              <Text style={styles.imageOverlayText}>Morning anchor reflection</Text>
            </View>
          </View>
          
          <View style={styles.aiReflectionBox}>
            <View style={styles.aiIconWrapper}>
              <Ionicons name="sparkles" size={14} color={colors.textInverse} />
            </View>
            <View style={styles.aiTextContent}>
              <Text style={styles.aiTitle}>Maya's Gentle Mirror</Text>
              <Text style={styles.aiBody}>"Notice your growing ability to catch worry before it spirals. That somatic pause is already rewiring your morning."</Text>
            </View>
          </View>
          
          <View style={styles.entryActionsRow}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity><Text style={styles.actionText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.actionTextError}>Delete</Text></TouchableOpacity>
            </View>
            <TouchableOpacity><Text style={styles.actionTextLock}>Lock Entry</Text></TouchableOpacity>
          </View>
        </View>

        {/* Weekly Weather */}
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="stats-chart" size={18} color={colors.secondary} style={{marginRight: 8}}/>
              <Text style={styles.sectionTitleStream}>Weekly Emotional Weather</Text>
            </View>
            <Text style={styles.weeklyStatus}>mostly grounded</Text>
          </View>
          <View style={styles.chartRow}>
            {[{l:'M', h:60, c:'#DBE1FF'}, {l:'T', h:40, c:'#84997b'}, {l:'W', h:50, c:'#edd8fe'}, {l:'T', h:100, c:colors.primary}, {l:'F', h:30, c:'#e3e7ff'}, {l:'S', h:20, c:'#f2f3ff'}, {l:'S', h:15, c:'#f2f3ff'}].map((bar, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.chartBar, { height: `${bar.h}%`, backgroundColor: bar.c }]} />
                <Text style={[styles.chartDay, bar.h===100 && {color: colors.primary, fontFamily: typography.fontFamily.sansSemiBold}]}>{bar.l}</Text>
              </View>
            ))}
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
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineLg,
    color: colors.textMain,
  },
  container: {
    paddingBottom: spacing.xl * 2,
  },
  privacyBanner: {
    marginHorizontal: spacing.gutter,
    flexDirection: 'row',
    backgroundColor: '#F2F3FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  privacyIconBox: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: '#c8ead9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  privacyTextContent: {
    flex: 1,
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  privacyBody: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMain,
  },
  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  writeBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textInverse,
    marginLeft: 4,
  },
  filtersScroll: {
    marginBottom: spacing.lg,
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    marginRight: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#c8ead9',
  },
  filterDot: {
    width: 6, height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  filterText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
  },
  filterTextActive: {
    color: '#133126',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleStream: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  promptsScroll: {
    marginBottom: spacing.xl,
    flexGrow: 0,
  },
  promptCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  promptHeaderTitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  promptText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm,
    color: colors.textMain,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  promptFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promptFooterText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
  },
  entryCountText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.gutter,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  entryDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  entryDateText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pinnedText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginLeft: 4,
  },
  entryTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  entryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDD8FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  entryTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: '#6d5c7c',
    marginLeft: 4,
  },
  entryBody: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  entryImageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  entryImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: spacing.sm,
    backgroundColor: 'rgba(28,37,65,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageOverlayText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: '#FFF',
    marginLeft: 4,
  },
  aiReflectionBox: {
    flexDirection: 'row',
    backgroundColor: '#F2F3FF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  aiIconWrapper: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
    marginBottom: 2,
  },
  aiBody: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMain,
    fontStyle: 'italic',
  },
  entryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  actionText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  actionTextError: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.error,
  },
  actionTextLock: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
  },
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.gutter,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weeklyStatus: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: colors.primary,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    paddingTop: 8,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBar: {
    width: '70%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  chartDay: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelSm,
    color: colors.textMuted,
    marginTop: 4,
  }
});

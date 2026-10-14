import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { journalApi } from '../services/api';

// =============================================================
// CATEGORIES & COLOR PALETTES
// =============================================================
const CATEGORIES = [
  { id: 'All Entries', label: 'All', icon: 'apps-outline', color: '#7A9A8B', bg: '#F4F7F5', border: '#D1DDD6' },
  { id: 'Reflective', label: 'Reflective', icon: 'leaf-outline', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'Gratitude', label: 'Gratitude', icon: 'sunny-outline', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { id: 'Peaceful', label: 'Peaceful', icon: 'heart-outline', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'Grounded', label: 'Grounded', icon: 'earth-outline', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
  { id: 'Unburdening', label: 'Unburdening', icon: 'cloud-outline', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
];

const MOOD_TAGS = [
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#10B981', bg: '#ECFDF5' },
  { id: 'grateful', label: 'Grateful', emoji: '✨', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'reflective', label: 'Reflective', emoji: '💭', color: '#6366F1', bg: '#EEF2FF' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🌸', color: '#EC4899', bg: '#FDF2F8' },
  { id: 'vulnerable', label: 'Vulnerable', emoji: '🌧️', color: '#64748B', bg: '#F1F5F9' },
  { id: 'centered', label: 'Centered', emoji: '🌿', color: '#059669', bg: '#ECFDF5' },
];

const PROMPTS = [
  {
    id: '1',
    title: 'Small Ordinary Miracles',
    category: 'Gratitude',
    icon: 'sunny',
    text: 'What three tiny, ordinary things went quietly right today that you can smile about?',
    accentColor: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    badge: 'Gratitude Spark'
  },
  {
    id: '2',
    title: 'Body & Breath Whispers',
    category: 'Peaceful',
    icon: 'leaf',
    text: 'Close your eyes. Where are you holding tension, and what is your body asking for right now?',
    accentColor: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    badge: 'Somatic Check-in'
  },
  {
    id: '3',
    title: 'Unburdening The Mind',
    category: 'Unburdening',
    icon: 'cloud',
    text: 'Write down whatever feels messy, unfair, or heavy right now. Give yourself permission to let it go.',
    accentColor: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    badge: 'Mental Release'
  },
  {
    id: '4',
    title: 'Letter to Future Self',
    category: 'Reflective',
    icon: 'mail',
    text: 'Write a compassionate, unhurried letter reminding yourself of your quiet strength and resilience.',
    accentColor: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    badge: 'Perspective'
  },
];

const DEFAULT_ENTRIES = [
  {
    id: 'sample-1',
    title: 'Finding quiet among the project storm',
    content: 'Woke up with racing thoughts about the quarterly presentation. Maya suggested taking three physiological sighs before opening my inbox. It completely shifted my morning from panic to calm intention.',
    category: 'Reflective',
    mood_tag: 'calm',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-2',
    title: 'A warm cup of mint tea and morning sunshine',
    content: 'Sat on the porch for ten uninterrupted minutes. Noticed the golden sunlight filtering through the maple leaves. Sometimes the softest moments are the ones that save our day.',
    category: 'Gratitude',
    mood_tag: 'grateful',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-3',
    title: 'Letting go of perfectionism',
    content: 'Reminding myself that "done" is better than "perfect". I am not responsible for solving everyone’s emotions today. My energy is sacred, and it is safe to set gentle boundaries.',
    category: 'Unburdening',
    mood_tag: 'centered',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    isSample: true,
  }
];

export default function JournalScreen() {
  const [activeFilter, setActiveFilter] = useState('All Entries');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [loading, setLoading] = useState(false);

  // Write modal state
  const [isWriteModalVisible, setIsWriteModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Reflective');
  const [newMoodTag, setNewMoodTag] = useState('calm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read full entry modal
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch entries from Supabase backend
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await journalApi.getEntries(search, activeFilter);
      if (res && res.data && res.data.length > 0) {
        setEntries(res.data);
      } else if (res && res.data && res.data.length === 0 && search.trim() === '' && activeFilter === 'All Entries') {
        setEntries(DEFAULT_ENTRIES);
      } else if (res && res.data) {
        setEntries(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch entries from API, using default/cached:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [activeFilter]);

  // Filtered entries locally when searching
  const displayedEntries = useMemo(() => {
    let result = entries;
    if (activeFilter !== 'All Entries') {
      result = result.filter(e => (e.category || '').toLowerCase() === activeFilter.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(e =>
        (e.title || '').toLowerCase().includes(q) ||
        (e.content || '').toLowerCase().includes(q) ||
        (e.category || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, activeFilter, search]);

  const handleCreateEntry = async () => {
    if (!newContent.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: newTitle.trim() || 'Untitled Reflection',
        content: newContent.trim(),
        category: newCategory,
        mood_tag: newMoodTag,
      };

      const res = await journalApi.createEntry(payload);
      if (res && res.data) {
        setEntries(prev => [res.data, ...prev.filter(e => !e.isSample)]);
      }
      setIsWriteModalVisible(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('Reflective');
      setNewMoodTag('calm');
    } catch (err) {
      console.warn('Failed to save journal to backend, preserving locally:', err.message);
      // Local optimistic fallback so user never loses entry
      const localEntry = {
        id: 'local-' + Date.now().toString(),
        title: newTitle.trim() || 'Untitled Reflection',
        content: newContent.trim(),
        category: newCategory,
        mood_tag: newMoodTag,
        created_at: new Date().toISOString(),
      };
      setEntries(prev => [localEntry, ...prev]);
      setIsWriteModalVisible(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('Reflective');
      setNewMoodTag('calm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = (id) => {
    Alert.alert(
      "Delete Reflection",
      "Are you sure you want to remove this journal entry from your sanctuary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Remove immediately from UI
            setEntries(prev => prev.filter(e => e.id !== id));
            if (selectedEntry && selectedEntry.id === id) {
              setSelectedEntry(null);
            }
            if (!id || String(id).startsWith('sample-') || String(id).startsWith('local-')) {
              return;
            }
            try {
              await journalApi.deleteEntry(id);
            } catch (err) {
              console.warn('Delete entry notice:', err.message);
            }
          }
        }
      ]
    );
  };

  const openPromptComposer = (prompt) => {
    setNewTitle(prompt.title);
    setNewContent(`"${prompt.text}"\n\n`);
    setNewCategory(prompt.category);
    setIsWriteModalVisible(true);
  };

  const handleShareEntry = async (entry) => {
    try {
      await Share.share({
        title: entry.title || 'Mindful Reflection',
        message: `"${entry.title || 'Reflection'}"\n\n${entry.content}\n\n— MindFul Sanctuary`
      });
    } catch (e) {}
  };

  const getCategoryConfig = (categoryName) => {
    const found = CATEGORIES.find(c => (c.id || '').toLowerCase() === (categoryName || '').toLowerCase());
    return found || CATEGORIES[1];
  };

  const getMoodConfig = (moodTag) => {
    const found = MOOD_TAGS.find(m => (m.id || '').toLowerCase() === (moodTag || '').toLowerCase());
    return found || MOOD_TAGS[0];
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ========================================================= */}
      {/* 1. COLORFUL SANCTUARY HEADER                              */}
      {/* ========================================================= */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.headerBadge}>
            <Ionicons name="sparkles" size={11} color="#059669" />
            <Text style={styles.headerBadgeText}>SANCTUARY JOURNAL</Text>
          </View>
          <Text style={styles.headerTitle}>Inner Reflections</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {/* Primary Colorful Write Button */}
        <TouchableOpacity
          style={styles.primaryWriteBtn}
          onPress={() => setIsWriteModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="create" size={17} color="#FFFFFF" />
          <Text style={styles.primaryWriteBtnText}>Write</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* ========================================================= */}
        {/* 2. COLORFUL QUICK STATS BANNER                            */}
        {/* ========================================================= */}
        <View style={styles.statsBanner}>
          <View style={[styles.statPill, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#10B981' }]}>
              <Ionicons name="book" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.statNumber}>{entries.length}</Text>
              <Text style={styles.statLabel}>Reflections</Text>
            </View>
          </View>

          <View style={[styles.statPill, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="flame" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.statNumber}>4 Days</Text>
              <Text style={styles.statLabel}>Calm Streak</Text>
            </View>
          </View>

          <View style={[styles.statPill, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#8B5CF6' }]}>
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Private</Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. VIBRANT SEARCH & ACTIONS BAR                           */}
        {/* ========================================================= */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color="#059669" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search thoughts, insights, prompts..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. COLORFUL CATEGORY FILTER PILLS                         */}
        {/* ========================================================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={{ paddingHorizontal: spacing.gutter, gap: 8 }}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeFilter === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: isActive ? cat.color : cat.bg, borderColor: cat.border }
                ]}
                onPress={() => setActiveFilter(cat.id)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : cat.color}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.filterChipText, { color: isActive ? '#FFFFFF' : cat.color }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ========================================================= */}
        {/* 5. GENTLE SPARKS: COLORFUL PROMPT CARDS                   */}
        {/* ========================================================= */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionIconBulb}>
              <Ionicons name="bulb" size={14} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>Daily Sparks & Prompts</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Tap any to write</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promptsScroll}
          contentContainerStyle={{ paddingHorizontal: spacing.gutter, gap: 12 }}
        >
          {PROMPTS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.promptCard, { backgroundColor: p.bgColor, borderColor: p.borderColor }]}
              onPress={() => openPromptComposer(p)}
              activeOpacity={0.8}
            >
              <View style={styles.promptTopRow}>
                <View style={[styles.promptBadgePill, { backgroundColor: '#FFFFFF', borderColor: p.borderColor }]}>
                  <Text style={[styles.promptBadgeText, { color: p.accentColor }]}>{p.badge}</Text>
                </View>
                <View style={[styles.promptIconCircle, { backgroundColor: p.accentColor }]}>
                  <Ionicons name={p.icon} size={13} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.promptCardTitle}>{p.title}</Text>
              <Text style={styles.promptCardText} numberOfLines={3}>"{p.text}"</Text>

              <View style={styles.promptCardFooter}>
                <Text style={[styles.promptCtaText, { color: p.accentColor }]}>Reflect with Maya</Text>
                <Ionicons name="arrow-forward" size={14} color={p.accentColor} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ========================================================= */}
        {/* 6. SANCTUARY STREAM (JOURNAL ENTRIES LIST)                */}
        {/* ========================================================= */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionIconBulb, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="water" size={14} color="#059669" />
            </View>
            <Text style={styles.sectionTitle}>Sanctuary Stream</Text>
          </View>
          <Text style={styles.entryCountBadge}>
            {displayedEntries.length} {displayedEntries.length === 1 ? 'Reflection' : 'Reflections'}
          </Text>
        </View>

        {loading && (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 14 }} />
        )}

        {/* Empty State */}
        {displayedEntries.length === 0 && !loading && (
          <View style={styles.emptyStateCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="leaf-outline" size={32} color="#059669" />
            </View>
            <Text style={styles.emptyTitle}>A Pure, Empty Canvas</Text>
            <Text style={styles.emptySubtitle}>
              {search.trim()
                ? `No reflections found matching "${search}".`
                : `No entries in "${activeFilter}". Tap below to begin your first reflection.`}
            </Text>
            <TouchableOpacity
              style={styles.emptyWriteBtn}
              onPress={() => setIsWriteModalVisible(true)}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyWriteBtnText}>Write a Reflection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dynamic Colorful Entry Cards */}
        {displayedEntries.map(entry => {
          const catConfig = getCategoryConfig(entry.category);
          const moodConfig = getMoodConfig(entry.mood_tag);

          return (
            <TouchableOpacity
              key={entry.id}
              style={[styles.entryCard, { borderLeftColor: catConfig.color }]}
              onPress={() => setSelectedEntry(entry)}
              activeOpacity={0.88}
            >
              {/* Top Row: Date + Category Badge + Mood Tag */}
              <View style={styles.entryTopRow}>
                <View style={styles.entryDateBox}>
                  <View style={[styles.pulseDot, { backgroundColor: catConfig.color }]} />
                  <Text style={styles.entryDateText}>
                    {entry.created_at
                      ? new Date(entry.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Recently Recorded'}
                  </Text>
                </View>

                <View style={styles.entryBadgesRight}>
                  {/* Category Pill */}
                  <View style={[styles.categoryBadge, { backgroundColor: catConfig.bg, borderColor: catConfig.border }]}>
                    <Ionicons name={catConfig.icon} size={11} color={catConfig.color} />
                    <Text style={[styles.categoryBadgeText, { color: catConfig.color }]}>
                      {entry.category || 'Reflective'}
                    </Text>
                  </View>

                  {/* Mood Pill */}
                  <View style={[styles.moodBadge, { backgroundColor: moodConfig.bg }]}>
                    <Text style={styles.moodEmoji}>{moodConfig.emoji}</Text>
                    <Text style={[styles.moodText, { color: moodConfig.color }]}>{moodConfig.label}</Text>
                  </View>
                </View>
              </View>

              {/* Title & Body Content */}
              <Text style={styles.entryTitle}>{entry.title || 'Untitled Reflection'}</Text>
              <Text style={styles.entryBody} numberOfLines={3}>
                {entry.content}
              </Text>

              {/* Card Footer Actions */}
              <View style={styles.entryFooterRow}>
                <View style={styles.entryFooterLeft}>
                  <TouchableOpacity
                    style={styles.readMoreBtn}
                    onPress={() => setSelectedEntry(entry)}
                  >
                    <Text style={[styles.readMoreText, { color: catConfig.color }]}>Read full reflection</Text>
                    <Ionicons name="chevron-forward" size={13} color={catConfig.color} />
                  </TouchableOpacity>
                </View>

                <View style={styles.entryFooterRight}>
                  <TouchableOpacity
                    style={styles.footerActionIconBtn}
                    onPress={() => handleShareEntry(entry)}
                  >
                    <Ionicons name="share-outline" size={16} color={colors.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.footerActionIconBtn, { backgroundColor: '#FEE2E2' }]}
                    onPress={() => handleDeleteEntry(entry.id)}
                  >
                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ========================================================= */}
        {/* 7. WEEKLY EMOTIONAL WEATHER (COLORFUL CHART)              */}
        {/* ========================================================= */}
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.sectionIconBulb, { backgroundColor: '#F5F3FF', marginRight: 8 }]}>
                <Ionicons name="sunny" size={16} color="#7C3AED" />
              </View>
              <Text style={styles.weeklyTitle}>Emotional Weather</Text>
            </View>
            <View style={styles.weeklyGroundedBadge}>
              <Text style={styles.weeklyGroundedText}>🌿 Mostly Grounded</Text>
            </View>
          </View>

          <Text style={styles.weeklyDesc}>
            Your nervous system experienced 4 sustained moments of deep presence this week.
          </Text>

          <View style={styles.chartRow}>
            {[
              { l: 'Mon', h: 65, c: '#059669', emoji: '🌿' },
              { l: 'Tue', h: 45, c: '#2563EB', emoji: '🌤️' },
              { l: 'Wed', h: 55, c: '#7C3AED', emoji: '🌸' },
              { l: 'Thu', h: 95, c: '#D97706', emoji: '✨' },
              { l: 'Fri', h: 40, c: '#0D9488', emoji: '😌' },
              { l: 'Sat', h: 80, c: '#EC4899', emoji: '💖' },
              { l: 'Sun', h: 70, c: '#10B981', emoji: '🌱' },
            ].map((bar, i) => (
              <View key={i} style={styles.chartCol}>
                <Text style={styles.chartBarEmoji}>{bar.emoji}</Text>
                <View style={styles.chartBarTrack}>
                  <View style={[styles.chartBarFill, { height: `${bar.h}%`, backgroundColor: bar.c }]} />
                </View>
                <Text style={[styles.chartDay, bar.h === 95 && { color: bar.c, fontFamily: typography.fontFamily.sansSemiBold }]}>
                  {bar.l}
                </Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* ========================================================= */}
      {/* 8. WRITE REFLECTION MODAL (RICH & USER FRIENDLY)          */}
      {/* ========================================================= */}
      <Modal
        visible={isWriteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsWriteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalHeaderIcon}>
                  <Ionicons name="pencil" size={16} color="#059669" />
                </View>
                <Text style={styles.modalTitle}>New Reflection</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsWriteModalVisible(false)}
              >
                <Ionicons name="close" size={20} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            {/* Category Selector Chips */}
            <Text style={styles.modalSectionLabel}>CHOOSE SANCTUARY CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCatRow}>
              {CATEGORIES.filter(c => c.id !== 'All Entries').map(cat => {
                const isSelected = newCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.modalCatChip,
                      {
                        backgroundColor: isSelected ? cat.color : cat.bg,
                        borderColor: cat.border,
                      }
                    ]}
                    onPress={() => setNewCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={13}
                      color={isSelected ? '#FFFFFF' : cat.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.modalCatText, { color: isSelected ? '#FFFFFF' : cat.color }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Mood Tag Selector */}
            <Text style={styles.modalSectionLabel}>HOW DOES YOUR HEART FEEL?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalCatRow}>
              {MOOD_TAGS.map(m => {
                const isSelected = newMoodTag === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.modalMoodChip,
                      {
                        backgroundColor: isSelected ? m.color : m.bg,
                        borderColor: isSelected ? m.color : '#E2E8F0'
                      }
                    ]}
                    onPress={() => setNewMoodTag(m.id)}
                  >
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{m.emoji}</Text>
                    <Text style={[styles.modalMoodText, { color: isSelected ? '#FFFFFF' : m.color }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Title Input */}
            <TextInput
              style={styles.modalTitleInput}
              placeholder="Title (e.g., A quiet revelation)"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={120}
            />

            {/* Content Input */}
            <TextInput
              style={styles.modalContentInput}
              placeholder="What emotions, sensations, or thoughts are alive in you? Pour them out freely without judgment..."
              placeholderTextColor="#94A3B8"
              value={newContent}
              onChangeText={setNewContent}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.modalContentFooter}>
              <Text style={styles.wordCountText}>
                {newContent.trim().length > 0 ? `${newContent.trim().split(/\s+/).length} words` : '0 words'}
              </Text>
              <Text style={styles.privacyGuarantee}>🔒 Stored confidentially</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.modalSaveBtn,
                (!newContent.trim() || isSubmitting) && styles.modalSaveBtnDisabled
              ]}
              onPress={handleCreateEntry}
              disabled={!newContent.trim() || isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.modalSaveBtnText}>Save to Sanctuary</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 9. READ ENTRY DETAIL MODAL (DISTRACTION-FREE VIEWER)      */}
      {/* ========================================================= */}
      <Modal
        visible={!!selectedEntry}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedEntry(null)}
      >
        <View style={styles.readerOverlay}>
          {selectedEntry && (
            <View style={styles.readerContainer}>
              {/* Header */}
              <View style={styles.readerHeader}>
                <View style={styles.readerCategoryPill}>
                  <Ionicons
                    name={getCategoryConfig(selectedEntry.category).icon}
                    size={13}
                    color={getCategoryConfig(selectedEntry.category).color}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.readerCategoryText, { color: getCategoryConfig(selectedEntry.category).color }]}>
                    {selectedEntry.category || 'Reflective'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.readerCloseBtn}
                  onPress={() => setSelectedEntry(null)}
                >
                  <Ionicons name="close" size={20} color={colors.textMain} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
                {/* Title */}
                <Text style={styles.readerTitle}>{selectedEntry.title || 'Untitled Reflection'}</Text>

                {/* Date & Mood metadata */}
                <View style={styles.readerMetaRow}>
                  <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.readerDateText}>
                    {selectedEntry.created_at
                      ? new Date(selectedEntry.created_at).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Recently Saved'}
                  </Text>
                  {selectedEntry.mood_tag && (
                    <Text style={styles.readerMoodTagText}>
                      · {getMoodConfig(selectedEntry.mood_tag).emoji} {getMoodConfig(selectedEntry.mood_tag).label}
                    </Text>
                  )}
                </View>

                {/* Content */}
                <Text style={styles.readerBodyText}>{selectedEntry.content}</Text>
              </ScrollView>

              {/* Reader Footer Buttons */}
              <View style={styles.readerFooter}>
                <TouchableOpacity
                  style={styles.readerShareBtn}
                  onPress={() => handleShareEntry(selectedEntry)}
                >
                  <Ionicons name="share-social-outline" size={16} color={colors.textMain} />
                  <Text style={styles.readerShareText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.readerDeleteBtn}
                  onPress={() => handleDeleteEntry(selectedEntry.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={styles.readerDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// =============================================================
// COLORFUL & MODERN STYLESHEET
// =============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },

  /* --- 1. HEADER --- */
  headerBar: {
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
  headerBadge: {
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
  headerBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#059669',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 24,
    color: colors.textMain,
  },
  headerDate: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  primaryWriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    gap: 5,
  },
  primaryWriteBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },

  container: {
    paddingBottom: spacing.xl * 2,
  },

  /* --- 2. STATS BANNER --- */
  statsBanner: {
    flexDirection: 'row',
    marginHorizontal: spacing.gutter,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    gap: 10,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 8,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 15,
    color: colors.textMain,
    lineHeight: 18,
  },
  statLabel: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10.5,
    color: colors.textMuted,
  },

  /* --- 3. SEARCH --- */
  searchRow: {
    marginHorizontal: spacing.gutter,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.22)',
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13.5,
    color: colors.textMain,
  },
  clearSearchBtn: {
    padding: 4,
  },

  /* --- 4. CATEGORY FILTERS --- */
  filtersScroll: {
    marginVertical: spacing.sm,
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  filterChipText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
  },

  /* --- 5. SECTION HEADERS --- */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.gutter,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconBulb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 17,
    color: colors.textMain,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: colors.textMuted,
  },
  entryCountBadge: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  /* --- GENTLE SPARKS (PROMPTS) --- */
  promptsScroll: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    flexGrow: 0,
  },
  promptCard: {
    width: 270,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
  },
  promptTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  promptBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  promptIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptCardTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 15,
    color: colors.textMain,
    marginBottom: 4,
  },
  promptCardText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12.5,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  promptCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  promptCtaText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
  },

  /* --- 6. SANCTUARY STREAM (ENTRY CARDS) --- */
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 16,
    marginHorizontal: spacing.gutter,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.15)',
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  entryDateText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: colors.textMuted,
  },
  entryBadgesRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  categoryBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 3,
  },
  moodEmoji: {
    fontSize: 11,
  },
  moodText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
  },
  entryTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 17,
    color: colors.textMain,
    marginBottom: 4,
  },
  entryBody: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 10,
  },
  entryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  entryFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  readMoreText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
  },
  entryFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerActionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- EMPTY STATE --- */
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 24,
    marginHorizontal: spacing.gutter,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  emptyIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 18,
    color: colors.textMain,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  emptyWriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  emptyWriteBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },

  /* --- 7. WEEKLY EMOTIONAL WEATHER --- */
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 16,
    marginHorizontal: spacing.gutter,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  weeklyTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 16.5,
    color: colors.textMain,
  },
  weeklyGroundedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  weeklyGroundedText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
    color: '#059669',
  },
  weeklyDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: 8,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBarEmoji: {
    fontSize: 12,
    marginBottom: 4,
  },
  chartBarTrack: {
    width: 22,
    height: 65,
    backgroundColor: '#F1F5F9',
    borderRadius: 11,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 11,
  },
  chartDay: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },

  /* --- 8. WRITE MODAL --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.gutter,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 19,
    color: colors.textMain,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSectionLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.7,
    marginTop: 6,
    marginBottom: 6,
  },
  modalCatRow: {
    flexDirection: 'row',
    flexGrow: 0,
    marginBottom: 10,
  },
  modalCatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: 8,
  },
  modalCatText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
  },
  modalMoodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: 8,
  },
  modalMoodText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
  },
  modalTitleInput: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 17,
    color: colors.textMain,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  modalContentInput: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 14.5,
    color: colors.textMain,
    minHeight: 130,
    maxHeight: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: 12,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalContentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  wordCountText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
  privacyGuarantee: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#059669',
  },
  modalSaveBtn: {
    backgroundColor: '#059669',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSaveBtnDisabled: {
    opacity: 0.5,
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14.5,
  },

  /* --- 9. READER MODAL --- */
  readerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.gutter,
  },
  readerContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  readerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  readerCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readerCategoryText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
  },
  readerCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 21,
    color: colors.textMain,
    marginBottom: 6,
    lineHeight: 28,
  },
  readerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  readerDateText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
  },
  readerMoodTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textMain,
  },
  readerBodyText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 15,
    color: '#334155',
    lineHeight: 25,
    marginBottom: 16,
  },
  readerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
    marginTop: 8,
  },
  readerShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readerShareText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: colors.textMain,
  },
  readerDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    gap: 6,
  },
  readerDeleteText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#EF4444',
  },
});

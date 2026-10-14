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
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme';
import { journalApi } from '../services/api';

// =============================================================
// CATEGORIES & MOODS CONFIGURATION
// =============================================================
const CATEGORIES = [
  { id: 'All Entries', label: 'All', icon: 'apps-outline', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'Gratitude', label: 'Gratitude', icon: 'sparkles-outline', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { id: 'Reflective', label: 'Reflective', icon: 'leaf-outline', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'Peaceful', label: 'Peaceful', icon: 'flower-outline', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'Unburdening', label: 'Release', icon: 'cloud-outline', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
];

const MOOD_TAGS = [
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#059669', bg: '#ECFDF5' },
  { id: 'grateful', label: 'Grateful', emoji: '✨', color: '#D97706', bg: '#FFFBEB' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🌸', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'reflective', label: 'Reflective', emoji: '💭', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'vulnerable', label: 'Heavy', emoji: '🌧️', color: '#475569', bg: '#F1F5F9' },
  { id: 'centered', label: 'Centered', emoji: '🌿', color: '#0D9488', bg: '#F0FDFA' },
];

// 4 Sleek Quick Inspiration Cards
const QUICK_TEMPLATES = [
  {
    id: 'free',
    title: 'Free Note',
    subtitle: 'Open thoughts',
    icon: 'create-outline',
    category: 'Reflective',
    mood: 'calm',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    promptTitle: '',
    promptContent: '',
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    subtitle: '3 good things',
    icon: 'sparkles-outline',
    category: 'Gratitude',
    mood: 'grateful',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    promptTitle: 'Three Small Joys Today',
    promptContent: '1. \n2. \n3. ',
  },
  {
    id: 'reflection',
    title: 'Check-in',
    subtitle: 'Mind & body',
    icon: 'leaf-outline',
    category: 'Peaceful',
    mood: 'peaceful',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    promptTitle: 'Midday Heart Check-in',
    promptContent: 'How is my energy feeling right now?\nWhat tension can I gently release?',
  },
  {
    id: 'unburden',
    title: 'Release',
    subtitle: 'Let it go',
    icon: 'cloud-outline',
    category: 'Unburdening',
    mood: 'vulnerable',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    promptTitle: 'Unloading My Mind',
    promptContent: 'Whatever feels heavy, messy, or unfair right now...',
  },
];

const DEFAULT_ENTRIES = [
  {
    id: 'sample-1',
    title: 'Morning pause and quiet coffee',
    content: 'Took three deep physiological sighs before opening my inbox. It completely shifted my morning from rush to grounded presence.',
    category: 'Reflective',
    mood_tag: 'calm',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-2',
    title: 'Three things that brought ease today',
    content: '1. The morning sun hitting the kitchen floor.\n2. A kind check-in text from an old friend.\n3. The relief of finishing a big task.',
    category: 'Gratitude',
    mood_tag: 'grateful',
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
    isSample: true,
  },
  {
    id: 'sample-3',
    title: 'Letting go of being perfect',
    content: 'Reminding myself that progress is gentle, not loud. I don’t have to solve everything today. Just taking the next simple step.',
    category: 'Unburdening',
    mood_tag: 'centered',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    isSample: true,
  },
];

export default function JournalScreen() {
  const [activeFilter, setActiveFilter] = useState('All Entries');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [loading, setLoading] = useState(false);

  // Composer Modal State
  const [isWriteModalVisible, setIsWriteModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Reflective');
  const [newMoodTag, setNewMoodTag] = useState('calm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reader Modal State
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Fetch entries from Supabase / API
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
      console.warn('Journal fetch notice, using cached list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [activeFilter]);

  // Local filtering for fast search
  const displayedEntries = useMemo(() => {
    let result = entries;
    if (activeFilter !== 'All Entries') {
      result = result.filter((e) => (e.category || '').toLowerCase() === activeFilter.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          (e.title || '').toLowerCase().includes(q) ||
          (e.content || '').toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, activeFilter, search]);

  const handleOpenTemplate = (tpl) => {
    setNewTitle(tpl.promptTitle);
    setNewContent(tpl.promptContent);
    setNewCategory(tpl.category);
    setNewMoodTag(tpl.mood);
    setIsWriteModalVisible(true);
  };

  const handleCreateEntry = async () => {
    if (!newContent.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      title: newTitle.trim() || 'Daily Reflection',
      content: newContent.trim(),
      category: newCategory,
      mood_tag: newMoodTag,
    };

    try {
      const res = await journalApi.createEntry(payload);
      if (res && res.data) {
        setEntries((prev) => [res.data, ...prev.filter((e) => !e.isSample)]);
      }
    } catch (err) {
      // Optimistic local add so the user never loses their writing
      const localEntry = {
        id: 'local-' + Date.now().toString(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      setEntries((prev) => [localEntry, ...prev]);
    } finally {
      setIsSubmitting(false);
      setIsWriteModalVisible(false);
      setNewTitle('');
      setNewContent('');
      setNewCategory('Reflective');
      setNewMoodTag('calm');
    }
  };

  const handleDeleteEntry = (id) => {
    Alert.alert('Delete Reflection', 'Are you sure you want to remove this reflection?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setEntries((prev) => prev.filter((e) => e.id !== id));
          if (selectedEntry && selectedEntry.id === id) {
            setSelectedEntry(null);
          }
          if (id && !String(id).startsWith('sample-') && !String(id).startsWith('local-')) {
            try {
              await journalApi.deleteEntry(id);
            } catch (err) {
              console.warn('Delete entry notice:', err.message);
            }
          }
        },
      },
    ]);
  };

  const handleShareEntry = async (entry) => {
    try {
      await Share.share({
        title: entry.title || 'Mindful Reflection',
        message: `"${entry.title || 'Reflection'}"\n\n${entry.content}\n\n— MindFul Journal`,
      });
    } catch (e) {}
  };

  const getCategoryConfig = (categoryName) => {
    const found = CATEGORIES.find((c) => (c.id || '').toLowerCase() === (categoryName || '').toLowerCase());
    return found || CATEGORIES[2];
  };

  const getMoodConfig = (moodTag) => {
    const found = MOOD_TAGS.find((m) => (m.id || '').toLowerCase() === (moodTag || '').toLowerCase());
    return found || MOOD_TAGS[0];
  };

  const wordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ========================================================= */}
      {/* 1. CLEAN TOP HEADER                                       */}
      {/* ========================================================= */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Journal</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
            {displayedEntries.length} {displayedEntries.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>

        {/* Floating / Compact New Note Button */}
        <TouchableOpacity
          style={styles.newEntryBtn}
          onPress={() => {
            setNewTitle('');
            setNewContent('');
            setNewCategory('Reflective');
            setNewMoodTag('calm');
            setIsWriteModalVisible(true);
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newEntryBtnText}>New Note</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================= */}
        {/* 2. DIVERSE QUICK COMPOSE CARDS (Visual, Minimal Text)     */}
        {/* ========================================================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.templatesScroll}
          contentContainerStyle={styles.templatesScrollContainer}
        >
          {QUICK_TEMPLATES.map((tpl) => (
            <TouchableOpacity
              key={tpl.id}
              style={[styles.templateCard, { backgroundColor: tpl.bg, borderColor: tpl.border }]}
              onPress={() => handleOpenTemplate(tpl)}
              activeOpacity={0.8}
            >
              <View style={[styles.templateIconCircle, { backgroundColor: tpl.color }]}>
                <Ionicons name={tpl.icon} size={16} color="#FFFFFF" />
              </View>
              <View style={styles.templateTextContainer}>
                <Text style={styles.templateTitle}>{tpl.title}</Text>
                <Text style={styles.templateSubtitle}>{tpl.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward" size={14} color={tpl.color} style={styles.templateArrow} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ========================================================= */}
        {/* 3. MINIMAL SEARCH BAR                                     */}
        {/* ========================================================= */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#059669" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search thoughts & reflections..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. SLEEK CATEGORY FILTER PILLS                            */}
        {/* ========================================================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContainer}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeFilter === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterPill,
                  isSelected ? { backgroundColor: cat.color, borderColor: cat.color } : { backgroundColor: '#FFFFFF' },
                ]}
                onPress={() => setActiveFilter(cat.id)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={cat.icon}
                  size={13}
                  color={isSelected ? '#FFFFFF' : cat.color}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.filterPillText, isSelected && { color: '#FFFFFF', fontWeight: '600' }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="small" color="#059669" style={{ marginVertical: 14 }} />}

        {/* ========================================================= */}
        {/* 5. CLEAN EMPTY STATE                                      */}
        {/* ========================================================= */}
        {displayedEntries.length === 0 && !loading && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="book-outline" size={28} color="#059669" />
            </View>
            <Text style={styles.emptyTitle}>Your quiet canvas</Text>
            <Text style={styles.emptySubtitle}>
              {search.trim() ? `No results for "${search}"` : 'Write your first thought, feeling, or moment of gratitude.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                setNewTitle('');
                setNewContent('');
                setIsWriteModalVisible(true);
              }}
            >
              <Ionicons name="pencil" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.emptyButtonText}>Write Reflection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================= */}
        {/* 6. AESTHETIC ENTRY CARDS (ALL FIELDS PRESENT)             */}
        {/* ========================================================= */}
        {displayedEntries.map((entry) => {
          const catConfig = getCategoryConfig(entry.category);
          const moodConfig = getMoodConfig(entry.mood_tag);
          const words = wordCount(entry.content);

          return (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => setSelectedEntry(entry)}
              activeOpacity={0.88}
            >
              {/* Top Meta Strip: Category Tag + Mood Badge + Date */}
              <View style={styles.entryTopBar}>
                <View style={styles.entryTopLeft}>
                  <View style={[styles.categoryTag, { backgroundColor: catConfig.bg, borderColor: catConfig.border }]}>
                    <Ionicons name={catConfig.icon} size={11} color={catConfig.color} style={{ marginRight: 3 }} />
                    <Text style={[styles.categoryTagText, { color: catConfig.color }]}>
                      {entry.category || 'Reflective'}
                    </Text>
                  </View>

                  <View style={[styles.moodTag, { backgroundColor: moodConfig.bg }]}>
                    <Text style={styles.moodTagEmoji}>{moodConfig.emoji}</Text>
                    <Text style={[styles.moodTagText, { color: moodConfig.color }]}>{moodConfig.label}</Text>
                  </View>
                </View>

                <Text style={styles.entryDate}>
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recent'}
                </Text>
              </View>

              {/* Title */}
              <Text style={styles.entryTitle} numberOfLines={1}>
                {entry.title || 'Daily Reflection'}
              </Text>

              {/* Snippet */}
              <Text style={styles.entrySnippet} numberOfLines={2}>
                {entry.content}
              </Text>

              {/* Bottom Strip: Word Count + Quick Action Buttons */}
              <View style={styles.entryBottomBar}>
                <View style={styles.wordCountPill}>
                  <Ionicons name="time-outline" size={12} color="#94A3B8" style={{ marginRight: 3 }} />
                  <Text style={styles.wordCountText}>{words} {words === 1 ? 'word' : 'words'}</Text>
                </View>

                <View style={styles.entryActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleShareEntry(entry)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="share-outline" size={16} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}
                    onPress={() => handleDeleteEntry(entry.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ========================================================= */}
      {/* 7. WRITE REFLECTION MODAL (CLEAN & COMPLETE FIELDS)       */}
      {/* ========================================================= */}
      <Modal
        visible={isWriteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsWriteModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalSheet}>
            {/* Sheet Handle */}
            <View style={styles.sheetHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Reflection</Text>
              <TouchableOpacity onPress={() => setIsWriteModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Field: Category Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.modalPillsScroll}
              contentContainerStyle={{ gap: 8, paddingBottom: 2 }}
            >
              {CATEGORIES.filter((c) => c.id !== 'All Entries').map((cat) => {
                const isSelected = newCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.modalCategoryPill,
                      isSelected
                        ? { backgroundColor: cat.color, borderColor: cat.color }
                        : { backgroundColor: cat.bg, borderColor: cat.border },
                    ]}
                    onPress={() => setNewCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={12}
                      color={isSelected ? '#FFFFFF' : cat.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.modalCategoryText, { color: isSelected ? '#FFFFFF' : cat.color }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Field: Mood Selector */}
            <View style={styles.modalMoodRow}>
              {MOOD_TAGS.map((m) => {
                const isSelected = newMoodTag === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.modalMoodBtn,
                      isSelected ? { backgroundColor: m.bg, borderColor: m.color, borderWidth: 1.5 } : {},
                    ]}
                    onPress={() => setNewMoodTag(m.id)}
                  >
                    <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                    <Text style={[styles.modalMoodBtnText, isSelected && { color: m.color, fontWeight: '700' }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Field: Title Input */}
            <TextInput
              style={styles.modalTitleInput}
              placeholder="Title (optional)"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={100}
            />

            {/* Field: Content Body Area */}
            <TextInput
              style={styles.modalContentInput}
              placeholder="Write your reflection, thoughts, or feelings here..."
              placeholderTextColor="#94A3B8"
              value={newContent}
              onChangeText={setNewContent}
              multiline
              textAlignVertical="top"
            />

            {/* Modal Bottom: Word Count & Save Button */}
            <View style={styles.modalBottomBar}>
              <Text style={styles.modalWordCount}>
                {newContent.trim() ? `${wordCount(newContent)} words` : '0 words'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (!newContent.trim() || isSubmitting) && styles.saveBtnDisabled,
                ]}
                onPress={handleCreateEntry}
                disabled={!newContent.trim() || isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={17} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.saveBtnText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ========================================================= */}
      {/* 8. READ FULL ENTRY MODAL (DISTRACTION-FREE)              */}
      {/* ========================================================= */}
      <Modal
        visible={!!selectedEntry}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedEntry(null)}
      >
        <View style={styles.readerBackdrop}>
          {selectedEntry && (
            <View style={styles.readerSheet}>
              {/* Header */}
              <View style={styles.readerHeader}>
                <View style={styles.entryTopLeft}>
                  <View
                    style={[
                      styles.categoryTag,
                      {
                        backgroundColor: getCategoryConfig(selectedEntry.category).bg,
                        borderColor: getCategoryConfig(selectedEntry.category).border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={getCategoryConfig(selectedEntry.category).icon}
                      size={11}
                      color={getCategoryConfig(selectedEntry.category).color}
                      style={{ marginRight: 3 }}
                    />
                    <Text
                      style={[
                        styles.categoryTagText,
                        { color: getCategoryConfig(selectedEntry.category).color },
                      ]}
                    >
                      {selectedEntry.category || 'Reflective'}
                    </Text>
                  </View>

                  {selectedEntry.mood_tag && (
                    <View
                      style={[
                        styles.moodTag,
                        { backgroundColor: getMoodConfig(selectedEntry.mood_tag).bg },
                      ]}
                    >
                      <Text style={styles.moodTagEmoji}>{getMoodConfig(selectedEntry.mood_tag).emoji}</Text>
                      <Text
                        style={[
                          styles.moodTagText,
                          { color: getMoodConfig(selectedEntry.mood_tag).color },
                        ]}
                      >
                        {getMoodConfig(selectedEntry.mood_tag).label}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity onPress={() => setSelectedEntry(null)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Title & Date */}
              <Text style={styles.readerTitle}>{selectedEntry.title || 'Daily Reflection'}</Text>
              <Text style={styles.readerDate}>
                {selectedEntry.created_at
                  ? new Date(selectedEntry.created_at).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent entry'}
              </Text>

              {/* Content Body */}
              <ScrollView showsVerticalScrollIndicator={false} style={styles.readerBodyScroll}>
                <Text style={styles.readerContentText}>{selectedEntry.content}</Text>
              </ScrollView>

              {/* Reader Action Bar */}
              <View style={styles.readerActionBar}>
                <TouchableOpacity
                  style={styles.readerShareBtn}
                  onPress={() => handleShareEntry(selectedEntry)}
                >
                  <Ionicons name="share-outline" size={16} color="#1E293B" style={{ marginRight: 6 }} />
                  <Text style={styles.readerShareText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.readerDeleteBtn}
                  onPress={() => handleDeleteEntry(selectedEntry.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
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
// CLEAN & SLEEK STYLESHEET
// =============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },

  /* 1. Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 26,
    color: '#0F172A',
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  newEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  newEntryBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13.5,
    color: '#FFFFFF',
    marginLeft: 4,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  /* 2. Quick Templates Carousel */
  templatesScroll: {
    marginTop: 14,
    marginBottom: 10,
    flexGrow: 0,
  },
  templatesScrollContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    minWidth: 148,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  templateIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  templateTextContainer: {
    flex: 1,
  },
  templateTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#0F172A',
  },
  templateSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  templateArrow: {
    marginLeft: 6,
  },

  /* 3. Search Bar */
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13.5,
    color: '#0F172A',
  },

  /* 4. Filter Pills */
  filterScroll: {
    marginVertical: 6,
    flexGrow: 0,
  },
  filterScrollContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#64748B',
  },

  /* 5. Empty State */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 28,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '600',
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  emptyButtonText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },

  /* 6. Entry Card */
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  entryTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  categoryTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: radius.pill,
  },
  moodTagEmoji: {
    fontSize: 10.5,
    marginRight: 3,
  },
  moodTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
  },
  entryDate: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: '#94A3B8',
  },
  entryTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 16.5,
    color: '#0F172A',
    fontWeight: '600',
    marginBottom: 4,
  },
  entrySnippet: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18.5,
    marginBottom: 10,
  },
  entryBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  wordCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordCountText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: '#94A3B8',
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 7. Composer Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    maxHeight: '90%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 19,
    color: '#0F172A',
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalPillsScroll: {
    marginBottom: 10,
    flexGrow: 0,
  },
  modalCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  modalCategoryText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
  },
  modalMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalMoodBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 7,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 46,
  },
  modalMoodBtnText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalTitleInput: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  modalContentInput: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 140,
    maxHeight: 220,
    lineHeight: 21,
    marginBottom: 12,
  },
  modalBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalWordCount: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#94A3B8',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  saveBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13.5,
    color: '#FFFFFF',
  },

  /* 8. Reader Modal */
  readerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  readerSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  readerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  readerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 21,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 2,
  },
  readerDate: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  readerBodyScroll: {
    maxHeight: 280,
    marginBottom: 16,
  },
  readerContentText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 23,
  },
  readerActionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  readerShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  readerShareText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#1E293B',
  },
  readerDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '#FEE2E2',
  },
  readerDeleteText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#EF4444',
  },
});

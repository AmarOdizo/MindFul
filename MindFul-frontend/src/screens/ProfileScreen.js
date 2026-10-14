import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';

// Curated Calming Avatars for Profile Customization
const AVATAR_OPTIONS = [
  {
    id: 'lotus',
    label: 'Zen Blossom',
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'forest',
    label: 'Forest Calm',
    uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'ocean',
    label: 'Ocean Spirit',
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'dawn',
    label: 'Golden Dawn',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'night',
    label: 'Star Sanctuary',
    uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'mountain',
    label: 'Mountain Breeze',
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
];

const GOAL_OPTIONS = [5, 10, 15, 20, 30];

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();

  // Profile Information States
  const [bio, setBio] = useState('Seeking daily calm, conscious breathing, and mindful clarity.');
  const [dailyGoal, setDailyGoal] = useState(15);
  const [avatarUri, setAvatarUri] = useState(
    user?.avatar || AVATAR_OPTIONS[0].uri
  );

  // Edit Profile Modal States
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState(user?.name || 'Sanctuary Seeker');
  const [tempBio, setTempBio] = useState(bio);
  const [tempGoal, setTempGoal] = useState(dailyGoal);
  const [tempAvatar, setTempAvatar] = useState(avatarUri);

  // Companion & Notification Toggles
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [morningEnabled, setMorningEnabled] = useState(true);
  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [digestEnabled, setDigestEnabled] = useState(false);

  // Maya Impressions State
  const [memories, setMemories] = useState([
    { id: '1', text: 'Noticed heightened workplace anxiety around deadlines' },
    { id: '2', text: 'Prefers 4-7-8 breathing exercises before 10 PM sleep' },
    { id: '3', text: 'Finds calming relief in emerald and nature atmospheres' },
  ]);
  const [newMemoryInput, setNewMemoryInput] = useState('');
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  // Open Edit Modal
  const handleOpenEditModal = () => {
    setTempName(user?.name || 'Sanctuary Seeker');
    setTempBio(bio);
    setTempGoal(dailyGoal);
    setTempAvatar(avatarUri);
    setIsEditModalVisible(true);
  };

  // Save Profile Edits
  const handleSaveProfile = () => {
    const updatedName = tempName.trim() || 'Sanctuary Seeker';
    const updatedBio = tempBio.trim() || 'Mindful Sanctuary Seeker';
    setBio(updatedBio);
    setDailyGoal(tempGoal);
    setAvatarUri(tempAvatar);

    if (updateUser) {
      updateUser({
        name: updatedName,
        bio: updatedBio,
        dailyGoal: tempGoal,
        avatar: tempAvatar,
      });
    }

    setIsEditModalVisible(false);
    Alert.alert('Profile Updated', 'Your sanctuary settings have been gently saved. ✨');
  };

  // Memory Management
  const removeMemory = (id) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleAddMemory = () => {
    if (!newMemoryInput.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      text: newMemoryInput.trim(),
    };
    setMemories([newEntry, ...memories]);
    setNewMemoryInput('');
    setIsAddingMemory(false);
  };

  const handleClearAllMemories = () => {
    Alert.alert(
      'Reset Companion Memory',
      'Maya will gently clear all stored reflections and start with a fresh emotional canvas.',
      [
        { text: 'Keep Impressions', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setMemories([]),
        },
      ]
    );
  };

  // Archive Export Feedback
  const handleExportArchive = () => {
    Alert.alert(
      'Personal Sanctuary Archive',
      'Your encrypted emotional trail & journal entries have been compiled securely (GDPR compliant).',
      [{ text: 'Great, Thank You' }]
    );
  };

  // Sign Out Handler
  const handleSignOut = () => {
    Alert.alert(
      'Leave Sanctuary',
      'Are you sure you wish to sign out of MindFul?',
      [
        { text: 'Stay Here', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'WelcomeScreen' }],
            });
          },
        },
      ]
    );
  };

  const displayName = user?.name || 'Sanctuary Seeker';
  const displayEmail = user?.email || 'seeker@mindful.app';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.brandBadge}>
            <Ionicons name="sparkles" size={12} color="#10B981" />
            <Text style={styles.brandBadgeText}>MINDFUL SANCTUARY</Text>
          </View>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.sosBtn}
            onPress={() => navigation.navigate('CrisisSupport')}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={14} color="#EF4444" />
            <Text style={styles.sosBtnText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IDENTITY CARD */}
        <View style={styles.identityHeroCard}>
          {/* Top Row with Avatar & Info */}
          <View style={styles.identityTopRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              <View style={styles.avatarPresencePulse} />
              <TouchableOpacity
                style={styles.avatarEditPencil}
                onPress={handleOpenEditModal}
                activeOpacity={0.8}
              >
                <Ionicons name="pencil" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.identityDetails}>
              <View style={styles.badgeRow}>
                <View style={styles.memberTierBadge}>
                  <Ionicons name="shield-checkmark" size={11} color="#059669" />
                  <Text style={styles.memberTierText}>Verified Member</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Online</Text>
                </View>
              </View>

              <Text style={styles.userNameText}>{displayName}</Text>
              <Text style={styles.userEmailText}>{displayEmail}</Text>

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleOpenEditModal}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={14} color="#6366F1" />
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* User Intention / Bio Quote Pill */}
          <View style={styles.intentionCard}>
            <View style={styles.intentionHeaderRow}>
              <Ionicons name="bulb-outline" size={14} color="#F59E0B" />
              <Text style={styles.intentionLabel}>SANCTUARY INTENTION</Text>
            </View>
            <Text style={styles.intentionQuoteText}>“{bio}”</Text>
          </View>

          {/* Maya Companion Bond Bar */}
          <View style={styles.companionSyncRow}>
            <View style={styles.companionSyncLeft}>
              <View style={styles.companionSyncIconBox}>
                <Ionicons name="planet" size={18} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.companionSyncTitle}>Maya AI Companion Bond</Text>
                <Text style={styles.companionSyncSubtitle}>Tier 3 Sanctuary Resonance</Text>
              </View>
            </View>
            <View style={styles.syncScorePill}>
              <Text style={styles.syncScoreText}>98% Sync</Text>
            </View>
          </View>
        </View>

        {/* SECTION: WELLNESS STATS DECK (4 Vibrant Cards) */}
        <View style={styles.sectionArea}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="stats-chart" size={18} color="#6366F1" />
              <Text style={styles.sectionTitle}>Wellness Journey</Text>
            </View>
            <Text style={styles.sectionSubBadge}>Lifetime Metrics</Text>
          </View>

          {/* Symmetrical Two-Row 2x2 Grid */}
          <View style={styles.statsContainer}>
            {/* Row 1: Streak (Amber) & Mindful Breathing (Emerald) */}
            <View style={styles.statsRow}>
              {/* Card 1: Active Streak */}
              <View style={[styles.statCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                <View style={styles.statCardTopRow}>
                  <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="flame" size={20} color="#D97706" />
                  </View>
                  <View style={[styles.statMiniTag, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.statMiniTagText, { color: '#B45309' }]}>🔥 Best: 14d</Text>
                  </View>
                </View>
                <View style={styles.statCardBottom}>
                  <Text style={[styles.statNumber, { color: '#92400E' }]}>7 Days</Text>
                  <Text style={styles.statLabel}>Active Streak</Text>
                  <View style={styles.statTrackBg}>
                    <View style={[styles.statTrackFill, { width: '70%', backgroundColor: '#F59E0B' }]} />
                  </View>
                </View>
              </View>

              {/* Card 2: Mindful Breathing */}
              <View style={[styles.statCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <View style={styles.statCardTopRow}>
                  <View style={[styles.statIconBox, { backgroundColor: '#D1FAE5' }]}>
                    <Ionicons name="leaf" size={20} color="#059669" />
                  </View>
                  <View style={[styles.statMiniTag, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[styles.statMiniTagText, { color: '#047857' }]}>🧘 12 Cycles</Text>
                  </View>
                </View>
                <View style={styles.statCardBottom}>
                  <Text style={[styles.statNumber, { color: '#065F46' }]}>48 Mins</Text>
                  <Text style={styles.statLabel}>Mindful Breathing</Text>
                  <View style={styles.statTrackBg}>
                    <View style={[styles.statTrackFill, { width: '85%', backgroundColor: '#10B981' }]} />
                  </View>
                </View>
              </View>
            </View>

            {/* Row 2: Mood Check-ins (Rose) & Target Pace (Purple) */}
            <View style={styles.statsRow}>
              {/* Card 3: Mood Check-ins */}
              <View style={[styles.statCard, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
                <View style={styles.statCardTopRow}>
                  <View style={[styles.statIconBox, { backgroundColor: '#FCE7F3' }]}>
                    <Ionicons name="happy" size={20} color="#DB2777" />
                  </View>
                  <View style={[styles.statMiniTag, { backgroundColor: '#FCE7F3' }]}>
                    <Text style={[styles.statMiniTagText, { color: '#BE185D' }]}>😊 High Rhythm</Text>
                  </View>
                </View>
                <View style={styles.statCardBottom}>
                  <Text style={[styles.statNumber, { color: '#9D174D' }]}>24 Logs</Text>
                  <Text style={styles.statLabel}>Mood Check-ins</Text>
                  <View style={styles.statTrackBg}>
                    <View style={[styles.statTrackFill, { width: '90%', backgroundColor: '#EC4899' }]} />
                  </View>
                </View>
              </View>

              {/* Card 4: Target Pace */}
              <View style={[styles.statCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
                <View style={styles.statCardTopRow}>
                  <View style={[styles.statIconBox, { backgroundColor: '#EDE9FE' }]}>
                    <Ionicons name="timer" size={20} color="#7C3AED" />
                  </View>
                  <View style={[styles.statMiniTag, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.statMiniTagText, { color: '#6D28D9' }]}>🎯 80% Today</Text>
                  </View>
                </View>
                <View style={styles.statCardBottom}>
                  <Text style={[styles.statNumber, { color: '#5B21B6' }]}>{dailyGoal}m / Day</Text>
                  <Text style={styles.statLabel}>Target Pace</Text>
                  <View style={styles.statTrackBg}>
                    <View style={[styles.statTrackFill, { width: '80%', backgroundColor: '#8B5CF6' }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: DAILY MINDFULNESS GOAL SELECTOR */}
        <View style={styles.sectionArea}>
          <View style={styles.cardBlock}>
            <View style={styles.goalHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardBlockTitle}>Daily Mindfulness Target</Text>
                <Text style={styles.cardBlockDesc}>
                  Dedicate a few calm minutes each day for 4-7-8 breathing and mindful grounding.
                </Text>
              </View>
              <View style={styles.goalBadgeActive}>
                <Ionicons name="trophy" size={14} color="#D97706" />
                <Text style={styles.goalBadgeActiveText}>{dailyGoal} Mins</Text>
              </View>
            </View>

            {/* Goal Pills */}
            <View style={styles.goalPillsRow}>
              {GOAL_OPTIONS.map((mins) => {
                const isActive = dailyGoal === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.goalPill,
                      isActive && styles.goalPillSelected,
                    ]}
                    onPress={() => setDailyGoal(mins)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.goalPillText,
                        isActive && styles.goalPillTextSelected,
                      ]}
                    >
                      {mins}m
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* SECTION: AI COMPANION & MEMORY */}
        <View style={styles.sectionArea}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="color-wand" size={18} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>AI Companion & Memory</Text>
            </View>
            <View style={styles.adaptiveBadge}>
              <Text style={styles.adaptiveBadgeText}>Adaptive AI</Text>
            </View>
          </View>

          <View style={styles.cardBlock}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.settingMainTitle}>Personalized Memory</Text>
                  <View style={styles.activePillTag}>
                    <Text style={styles.activePillTagText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.cardBlockDesc}>
                  Maya remembers your reflections, preferred breathing rhythms, and mood patterns.
                </Text>
              </View>
              <Switch
                value={memoryEnabled}
                onValueChange={setMemoryEnabled}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Impressions list */}
            {memoryEnabled && (
              <View style={styles.memoryContainer}>
                <View style={styles.memoryContainerHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="layers" size={15} color="#6366F1" />
                    <Text style={styles.memoryContainerTitle}>
                      {' '}Stored Impressions ({memories.length})
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsAddingMemory(!isAddingMemory)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addImpressionLink}>
                      {isAddingMemory ? 'Cancel' : '+ Add Note'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Add Custom Impression Input */}
                {isAddingMemory && (
                  <View style={styles.addMemoryInputArea}>
                    <TextInput
                      style={styles.addMemoryInput}
                      placeholder="e.g. Prefer soft chimes before evening sleep"
                      placeholderTextColor="#94A3B8"
                      value={newMemoryInput}
                      onChangeText={setNewMemoryInput}
                    />
                    <TouchableOpacity
                      style={styles.addMemorySaveBtn}
                      onPress={handleAddMemory}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      <Text style={styles.addMemorySaveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {memories.map((m) => (
                  <View key={m.id} style={styles.memoryItemCard}>
                    <View style={styles.memoryDotIndicator} />
                    <Text style={styles.memoryItemText} numberOfLines={2}>
                      {m.text}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeMemory(m.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.clearMemoryFooter}>
                  <Text style={styles.clearMemoryHint}>Start fresh with Maya anytime?</Text>
                  <TouchableOpacity
                    style={styles.clearMemoryBtn}
                    onPress={handleClearAllMemories}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <Text style={styles.clearMemoryBtnText}>Clear Memories</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* SECTION: GENTLE CADENCE & NOTIFICATIONS */}
        <View style={styles.sectionArea}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="notifications" size={18} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Gentle Cadence & Alarms</Text>
            </View>
          </View>

          <View style={styles.cardBlock}>
            {/* Morning Chime */}
            <View style={styles.switchRow}>
              <View style={styles.switchIconLeft}>
                <View style={[styles.cadenceIconBubble, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="sunny" size={18} color="#D97706" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.settingMainTitle}>Morning Awakening</Text>
                  <Text style={styles.cardBlockDesc}>Gentle chime & positive prompt at 8:30 AM</Text>
                </View>
              </View>
              <Switch
                value={morningEnabled}
                onValueChange={setMorningEnabled}
                trackColor={{ false: '#E2E8F0', true: '#F59E0B' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingDivider} />

            {/* Evening Sanctuary */}
            <View style={styles.switchRow}>
              <View style={styles.switchIconLeft}>
                <View style={[styles.cadenceIconBubble, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="moon" size={18} color="#7C3AED" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.settingMainTitle}>Evening Sanctuary</Text>
                  <Text style={styles.cardBlockDesc}>4-7-8 breathing unwind reminder at 9:00 PM</Text>
                </View>
              </View>
              <Switch
                value={eveningEnabled}
                onValueChange={setEveningEnabled}
                trackColor={{ false: '#E2E8F0', true: '#8B5CF6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingDivider} />

            {/* Weekly Digest */}
            <View style={styles.switchRow}>
              <View style={styles.switchIconLeft}>
                <View style={[styles.cadenceIconBubble, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="mail" size={18} color="#0284C7" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.settingMainTitle}>Weekly Rhythm Summary</Text>
                  <Text style={styles.cardBlockDesc}>Sunday emotional insights & progress metrics</Text>
                </View>
              </View>
              <Switch
                value={digestEnabled}
                onValueChange={setDigestEnabled}
                trackColor={{ false: '#E2E8F0', true: '#0EA5E9' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* SECTION: PRIVACY & DATA SECURITY */}
        <View style={styles.sectionArea}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
              <Text style={styles.sectionTitle}>Privacy & Emotional Data</Text>
            </View>
          </View>

          <View style={styles.cardBlock}>
            {/* Biometric Lock */}
            <View style={styles.switchRow}>
              <View style={styles.switchIconLeft}>
                <View style={[styles.cadenceIconBubble, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="finger-print" size={18} color="#059669" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.settingMainTitle}>Local Biometric Vault</Text>
                  <Text style={styles.cardBlockDesc}>Require Face ID / Fingerprint to open journals</Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingDivider} />

            {/* Download Archive */}
            <TouchableOpacity
              style={styles.clickableOptionRow}
              onPress={handleExportArchive}
              activeOpacity={0.7}
            >
              <View style={styles.switchIconLeft}>
                <View style={[styles.cadenceIconBubble, { backgroundColor: '#F1F5F9' }]}>
                  <Ionicons name="cloud-download-outline" size={18} color="#475569" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.settingMainTitle}>Export Personal Archive</Text>
                  <Text style={styles.cardBlockDesc}>Download encrypted reflections (GDPR/CCPA)</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            {/* Erase Account */}
            <TouchableOpacity
              style={styles.clickableOptionRow}
              onPress={() => {
                Alert.alert(
                  'Erase Emotional Trail',
                  'This action permanently wipes your local reflections and data. Are you sure?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Permanently Erase', style: 'destructive', onPress: () => Alert.alert('Trail Erased', 'Your records have been cleared.') },
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <View style={styles.switchIconLeft}>
                <View style={[styles.cadenceIconBubble, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="trash" size={18} color="#DC2626" />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={[styles.settingMainTitle, { color: '#DC2626' }]}>
                    Erase Account & Sanctuary Data
                  </Text>
                  <Text style={styles.cardBlockDesc}>Irrevocable erasure of all logs</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SIGN OUT & FOOTER */}
        <View style={styles.footerSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.signOutButtonText}>Sign Out of Sanctuary</Text>
          </TouchableOpacity>

          <Text style={styles.footerVersionNotice}>
            MINDFUL AI • Version 3.5.0 • Sanctuary Build
          </Text>
          <Text style={styles.footerSecurityNotice}>
            🔒 Protected by Zero-Knowledge Encryption Architecture
          </Text>
        </View>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            {/* Modal Header */}
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <Text style={styles.modalSubtitle}>Customize your sanctuary identity</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Choose Avatar */}
              <Text style={styles.inputSectionLabel}>Choose Your Avatar</Text>
              <View style={styles.avatarPickerRow}>
                {AVATAR_OPTIONS.map((item) => {
                  const isSelected = tempAvatar === item.uri;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.avatarChoiceBtn,
                        isSelected && styles.avatarChoiceBtnSelected,
                      ]}
                      onPress={() => setTempAvatar(item.uri)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.uri }} style={styles.avatarChoiceImg} />
                      {isSelected && (
                        <View style={styles.avatarCheckBadge}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Full Name Input */}
              <Text style={styles.inputSectionLabel}>Your Name</Text>
              <View style={styles.textInputContainer}>
                <Ionicons name="person-outline" size={18} color="#6366F1" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInputField}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Sanctuary Bio / Intention */}
              <Text style={styles.inputSectionLabel}>Personal Intention / Bio</Text>
              <View style={[styles.textInputContainer, { height: 80, alignItems: 'flex-start', paddingTop: 10 }]}>
                <Ionicons name="heart-outline" size={18} color="#EC4899" style={[styles.inputIcon, { marginTop: 2 }]} />
                <TextInput
                  style={[styles.textInputField, { height: 60, textAlignVertical: 'top' }]}
                  value={tempBio}
                  onChangeText={setTempBio}
                  placeholder="What brings you to your sanctuary today?"
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              {/* Daily Target Goal */}
              <Text style={styles.inputSectionLabel}>Daily Mindfulness Target</Text>
              <View style={styles.modalGoalRow}>
                {GOAL_OPTIONS.map((mins) => {
                  const isSelected = tempGoal === mins;
                  return (
                    <TouchableOpacity
                      key={mins}
                      style={[
                        styles.modalGoalPill,
                        isSelected && styles.modalGoalPillSelected,
                      ]}
                      onPress={() => setTempGoal(mins)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.modalGoalPillText,
                          isSelected && styles.modalGoalPillTextSelected,
                        ]}
                      >
                        {mins}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveProfile}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.modalSaveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header Bar */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  brandBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#059669',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineLg,
    color: colors.textMain,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  sosBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelSm,
    color: '#DC2626',
    fontWeight: '700',
  },

  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.xl * 2,
  },

  /* Hero Identity Card */
  identityHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarImg: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#E2E8F0',
    borderWidth: 2.5,
    borderColor: '#EEF2FF',
  },
  avatarPresencePulse: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarEditPencil: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  identityDetails: {
    flex: 1,
    paddingTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  memberTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 3,
  },
  memberTierText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#065F46',
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  statusPillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9,
    color: '#4F46E5',
  },
  userNameText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
    lineHeight: 28,
  },
  userEmailText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
    marginTop: 2,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginTop: 8,
    gap: 4,
  },
  editProfileButtonText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '700',
  },

  /* Intention Card */
  intentionCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.lg,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  intentionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  intentionLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#D97706',
    letterSpacing: 0.8,
  },
  intentionQuoteText: {
    fontFamily: typography.fontFamily.serifRegular,
    fontSize: typography.sizes.bodySm,
    color: '#78350F',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  /* Maya Sync Bar */
  companionSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderRadius: radius.lg,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  companionSyncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companionSyncIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionSyncTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelMd,
    color: '#4C1D95',
  },
  companionSyncSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#6D28D9',
  },
  syncScorePill: {
    backgroundColor: '#DDD6FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  syncScoreText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#4C1D95',
    fontWeight: '700',
  },

  /* Sections Common */
  sectionArea: {
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.headlineSm,
    color: colors.textMain,
  },
  sectionSubBadge: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },

  /* Stats Grid */
  statsContainer: {
    gap: 12,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.xl,
    padding: 13,
    borderWidth: 1.5,
    minHeight: 136,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statMiniTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statMiniTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    fontWeight: '700',
  },
  statCardBottom: {
    marginTop: 2,
  },
  statNumber: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  statTrackBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  statTrackFill: {
    height: '100%',
    borderRadius: 2,
  },

  /* Common Card Block */
  cardBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBlockTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textMain,
  },
  cardBlockDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },

  /* Goal Selector */
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  goalBadgeActiveText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#B45309',
    fontWeight: '700',
  },
  goalPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  goalPillSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  goalPillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  goalPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Companion Memory */
  adaptiveBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  adaptiveBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#6D28D9',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingMainTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textMain,
  },
  activePillTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginLeft: 6,
  },
  activePillTagText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#065F46',
  },
  memoryContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.lg,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memoryContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  memoryContainerTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textMain,
  },
  addImpressionLink: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#6366F1',
  },
  addMemoryInputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  addMemoryInput: {
    flex: 1,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    fontSize: 12,
    fontFamily: typography.fontFamily.sansRegular,
    color: colors.textMain,
  },
  addMemorySaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: radius.md,
    gap: 4,
  },
  addMemorySaveBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  memoryItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  memoryDotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginRight: 8,
  },
  memoryItemText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMain,
    lineHeight: 17,
  },
  clearMemoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 6,
  },
  clearMemoryHint: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
  clearMemoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  clearMemoryBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#EF4444',
  },

  /* Cadence & Privacy Common */
  switchIconLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cadenceIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  clickableOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* Footer & Sign Out */
  footerSection: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    width: '100%',
    height: 50,
    borderRadius: radius.xl,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutButtonText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: '#DC2626',
    fontWeight: '700',
  },
  footerVersionNotice: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 14,
  },
  footerSecurityNotice: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#059669',
    marginTop: 4,
  },

  /* Edit Profile Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl * 1.2,
    borderTopRightRadius: radius.xl * 1.2,
    maxHeight: '85%',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd,
    color: colors.textMain,
  },
  modalSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollContent: {
    paddingVertical: spacing.md,
  },
  inputSectionLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textMain,
    marginBottom: 8,
    marginTop: 12,
  },

  /* Avatar Picker */
  avatarPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  avatarChoiceBtn: {
    position: 'relative',
    borderRadius: 24,
    padding: 2,
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  avatarChoiceBtnSelected: {
    borderColor: '#6366F1',
  },
  avatarChoiceImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  avatarCheckBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#6366F1',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* Text Inputs */
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInputField: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMain,
  },

  /* Modal Goal Selector */
  modalGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  modalGoalPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalGoalPillSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  modalGoalPillText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  modalGoalPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Modal Action Buttons */
  modalActionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textMuted,
  },
  modalSaveBtn: {
    flex: 2,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSaveBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

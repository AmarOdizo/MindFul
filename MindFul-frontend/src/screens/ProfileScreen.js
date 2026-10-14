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

// Curated calming avatars for profile customization
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
  const [bio, setBio] = useState(
    user?.bio || 'Seeking daily calm, conscious breathing, and mindful clarity.'
  );
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 15);
  const [avatarUri, setAvatarUri] = useState(
    user?.avatar || AVATAR_OPTIONS[0].uri
  );

  // Edit Profile Modal States
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState(user?.name || 'Sanctuary Seeker');
  const [tempBio, setTempBio] = useState(bio);
  const [tempGoal, setTempGoal] = useState(dailyGoal);
  const [tempAvatar, setTempAvatar] = useState(avatarUri);

  // Settings & Toggles
  const [morningEnabled, setMorningEnabled] = useState(true);
  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [audioSounds, setAudioSounds] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

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
    const updatedBio = tempBio.trim() || 'Seeking daily calm, conscious breathing, and mindful clarity.';
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
    Alert.alert('Profile Saved', 'Your sanctuary profile has been updated ✨');
  };

  // Sign Out Handler
  const handleSignOut = () => {
    Alert.alert(
      'Leave Sanctuary',
      'Are you sure you wish to sign out of MindFul?',
      [
        { text: 'Cancel', style: 'cancel' },
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
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <Ionicons name="sparkles" size={11} color="#059669" />
            <Text style={styles.brandTag}>SANCTUARY PROFILE</Text>
          </View>
          <Text style={styles.headerTitle}>My Space</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => navigation.navigate('CrisisSupport')}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={13} color="#EF4444" />
            <Text style={styles.sosButtonText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO IDENTITY CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            {/* Avatar with edit overlay */}
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleOpenEditModal}
              activeOpacity={0.85}
            >
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              <View style={styles.avatarPencilBadge}>
                <Ionicons name="pencil" size={11} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* User Info */}
            <View style={styles.heroUserInfo}>
              <View style={styles.memberTagRow}>
                <View style={styles.memberTag}>
                  <Ionicons name="shield-checkmark" size={10} color="#059669" />
                  <Text style={styles.memberTagText}>Mindful Seeker</Text>
                </View>
              </View>
              <Text style={styles.userName} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {displayEmail}
              </Text>
            </View>

            {/* Quick Edit Action Button */}
            <TouchableOpacity
              style={styles.editBtnSmall}
              onPress={handleOpenEditModal}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={14} color="#059669" />
              <Text style={styles.editBtnSmallText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* User Intention / Bio Quote Box */}
          <View style={styles.bioContainer}>
            <View style={styles.bioHeaderRow}>
              <Ionicons name="bulb-outline" size={12} color="#D97706" />
              <Text style={styles.bioLabel}>DAILY INTENTION</Text>
            </View>
            <Text style={styles.bioText} numberOfLines={2}>
              "{bio}"
            </Text>
          </View>
        </View>

        {/* 4 COMPACT JOURNEY STATS */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionHeaderTitle}>Wellness Journey</Text>

          <View style={styles.statsGrid}>
            {/* Streak */}
            <View style={[styles.statCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <View style={styles.statTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="flame" size={15} color="#D97706" />
                </View>
                <Text style={[styles.statBadge, { color: '#B45309', backgroundColor: '#FEF3C7' }]}>
                  🔥 Best 14d
                </Text>
              </View>
              <Text style={[styles.statValue, { color: '#92400E' }]}>7 Days</Text>
              <Text style={styles.statLabel}>Calm Streak</Text>
            </View>

            {/* Breathing */}
            <View style={[styles.statCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <View style={styles.statTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="leaf" size={15} color="#059669" />
                </View>
                <Text style={[styles.statBadge, { color: '#047857', backgroundColor: '#D1FAE5' }]}>
                  🧘 12 Sessions
                </Text>
              </View>
              <Text style={[styles.statValue, { color: '#065F46' }]}>48 Mins</Text>
              <Text style={styles.statLabel}>Breathe Time</Text>
            </View>

            {/* Reflections */}
            <View style={[styles.statCard, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <View style={styles.statTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="journal" size={15} color="#2563EB" />
                </View>
                <Text style={[styles.statBadge, { color: '#1D4ED8', backgroundColor: '#DBEAFE' }]}>
                  ✨ Weekly
                </Text>
              </View>
              <Text style={[styles.statValue, { color: '#1E40AF' }]}>16 Entries</Text>
              <Text style={styles.statLabel}>Reflections</Text>
            </View>

            {/* Daily Goal */}
            <View style={[styles.statCard, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
              <View style={styles.statTop}>
                <View style={[styles.statIconWrap, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="timer" size={15} color="#7C3AED" />
                </View>
                <Text style={[styles.statBadge, { color: '#6D28D9', backgroundColor: '#EDE9FE' }]}>
                  🎯 Active
                </Text>
              </View>
              <Text style={[styles.statValue, { color: '#5B21B6' }]}>{dailyGoal}m / Day</Text>
              <Text style={styles.statLabel}>Daily Target</Text>
            </View>
          </View>
        </View>

        {/* DAILY GOAL SELECTOR */}
        <View style={styles.cardSection}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Mindfulness Goal</Text>
              <Text style={styles.cardSubtitle}>
                Target conscious minutes spent per day
              </Text>
            </View>
            <View style={styles.goalActivePill}>
              <Ionicons name="timer-outline" size={12} color="#059669" />
              <Text style={styles.goalActivePillText}>{dailyGoal} Mins</Text>
            </View>
          </View>

          <View style={styles.goalPillsRow}>
            {GOAL_OPTIONS.map((mins) => {
              const isSelected = dailyGoal === mins;
              return (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.goalPill,
                    isSelected && styles.goalPillSelected,
                  ]}
                  onPress={() => {
                    setDailyGoal(mins);
                    if (updateUser) updateUser({ dailyGoal: mins });
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.goalPillText,
                      isSelected && styles.goalPillTextSelected,
                    ]}
                  >
                    {mins}m
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CADENCE & NOTIFICATIONS */}
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>Daily Cadence & Reminders</Text>

          {/* Morning reminder */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="sunny" size={16} color="#D97706" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Morning Awakening</Text>
              <Text style={styles.settingDesc}>Mindful prompt & gratitude at 8:30 AM</Text>
            </View>
            <Switch
              value={morningEnabled}
              onValueChange={setMorningEnabled}
              trackColor={{ false: '#E2E8F0', true: '#7A9A8B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Evening reminder */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconWrap, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="moon" size={16} color="#7C3AED" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Evening Wind-Down</Text>
              <Text style={styles.settingDesc}>4-7-8 breathing unwind at 9:00 PM</Text>
            </View>
            <Switch
              value={eveningEnabled}
              onValueChange={setEveningEnabled}
              trackColor={{ false: '#E2E8F0', true: '#7A9A8B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Audio Chimes */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="volume-medium" size={16} color="#059669" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Breathing Chimes & Audio</Text>
              <Text style={styles.settingDesc}>Gentle bowl bowls during inhale & exhale</Text>
            </View>
            <Switch
              value={audioSounds}
              onValueChange={setAudioSounds}
              trackColor={{ false: '#E2E8F0', true: '#7A9A8B' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* SECURITY & PRIVACY */}
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>Privacy & Sanctuary Data</Text>

          {/* Biometrics */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="finger-print" size={16} color="#0284C7" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Local Biometric Lock</Text>
              <Text style={styles.settingDesc}>Require Face ID to view reflections</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E2E8F0', true: '#7A9A8B' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Export reflections */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() =>
              Alert.alert(
                'Personal Archive',
                'Your journal entries and breathing history have been exported securely.'
              )
            }
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconWrap, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="cloud-download-outline" size={16} color="#475569" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Export Personal Data</Text>
              <Text style={styles.settingDesc}>Download encrypted JSON journal archive</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* SUPPORT & ACTIONS */}
        <View style={styles.cardSection}>
          {/* Crisis support */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('CrisisSupport')}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="heart-circle" size={17} color="#DC2626" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: '#DC2626' }]}>
                Immediate Crisis Helpline
              </Text>
              <Text style={styles.settingDesc}>24/7 confidential free emotional support</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#DC2626" />
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIconWrap, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="log-out-outline" size={16} color="#4B5563" />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: '#4B5563' }]}>
                Sign Out of MindFul
              </Text>
              <Text style={styles.settingDesc}>Return to the sanctuary entrance</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styles.footerWrap}>
          <Text style={styles.footerVersion}>MINDFUL • VERSION 3.5</Text>
          <Text style={styles.footerSub}>🔒 Private, Local & Mindfully Designed</Text>
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
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <Text style={styles.modalSubtitle}>Customize your sanctuary identity</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              {/* Avatar Selector */}
              <Text style={styles.inputLabel}>Choose Your Avatar</Text>
              <View style={styles.avatarRow}>
                {AVATAR_OPTIONS.map((item) => {
                  const isSelected = tempAvatar === item.uri;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.avatarOption,
                        isSelected && styles.avatarOptionSelected,
                      ]}
                      onPress={() => setTempAvatar(item.uri)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.uri }} style={styles.avatarOptionImg} />
                      {isSelected && (
                        <View style={styles.avatarCheck}>
                          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Name Field */}
              <Text style={styles.inputLabel}>Your Name</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={15} color="#059669" />
                <TextInput
                  style={styles.inputField}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Bio / Daily Intention */}
              <Text style={styles.inputLabel}>Sanctuary Intention</Text>
              <View style={[styles.inputWrap, { height: 74, alignItems: 'flex-start', paddingTop: 8 }]}>
                <Ionicons name="heart-outline" size={15} color="#D97706" style={{ marginTop: 2 }} />
                <TextInput
                  style={[styles.inputField, { height: 56, textAlignVertical: 'top' }]}
                  value={tempBio}
                  onChangeText={setTempBio}
                  placeholder="What brings you to your sanctuary today?"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Daily Target in Modal */}
              <Text style={styles.inputLabel}>Daily Mindfulness Target</Text>
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

              {/* Modal Buttons */}
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveProfile}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.modalSaveText}>Save</Text>
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
    backgroundColor: '#FAF9F6',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  brandTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#059669',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2541',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  sosButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },

  /* Scroll container */
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },

  /* Hero Identity Card */
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  avatarPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroUserInfo: {
    flex: 1,
  },
  memberTagRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  memberTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  memberTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2541',
  },
  userEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  editBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  editBtnSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  bioContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bioHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  bioLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#D97706',
  },
  bioText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#475569',
    lineHeight: 16,
  },

  /* Journey Stats */
  statsSection: {
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C2541',
    marginBottom: 8,
    marginLeft: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '48.5%',
    borderRadius: 14,
    padding: 11,
    borderWidth: 1,
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    fontSize: 9,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },

  /* Card Section */
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C2541',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  goalActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  goalActivePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  goalPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 4,
  },
  goalPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  goalPillSelected: {
    backgroundColor: '#7A9A8B',
    borderColor: '#7A9A8B',
  },
  goalPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  goalPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Setting row */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 8,
  },
  settingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C2541',
  },
  settingDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  /* Footer */
  footerWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  footerVersion: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#94A3B8',
  },
  footerSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2541',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  modalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  avatarOption: {
    position: 'relative',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarOptionSelected: {
    borderColor: '#059669',
  },
  avatarOptionImg: {
    width: '100%',
    height: '100%',
  },
  avatarCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
  },
  inputField: {
    flex: 1,
    fontSize: 12,
    color: '#1C2541',
  },
  modalGoalRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  modalGoalPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalGoalPillSelected: {
    backgroundColor: '#7A9A8B',
    borderColor: '#7A9A8B',
  },
  modalGoalPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  modalGoalPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#7A9A8B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

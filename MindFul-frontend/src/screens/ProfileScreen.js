import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

export default function ProfileScreen({ navigation }) {
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [morningEnabled, setMorningEnabled] = useState(true);
  const [eveningEnabled, setEveningEnabled] = useState(true);
  const [memories, setMemories] = useState([
    { id: '1', text: 'Noticed heightened workplace anxiety around deadlines' },
    { id: '2', text: 'Prefers 4-7-8 breathing exercises before 10 PM sleep' }
  ]);

  const removeMemory = (id) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header Panel */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerBrand}>MINDFUL AI</Text>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.sosBtn} onPress={() => navigation.navigate('CrisisSupport')}>
            <Ionicons name="medical" size={14} color={colors.error} />
            <Text style={styles.sosBtnText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Warm Greeting & Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.identityRow}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="pencil" size={14} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            <View style={styles.identityDetails}>
              <View style={styles.badgeRow}>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                  <Text style={styles.verifiedText}>Verified Adult</Text>
                </View>
                <Text style={styles.ageText}>Age 24</Text>
              </View>
              <Text style={styles.nameText}>Elena Rostova</Text>
              <Text style={styles.memberText}>Mindful member since Sept 2023 · Gentle Pace</Text>
            </View>
          </View>
          
          <View style={styles.cadencePill}>
            <View style={styles.cadenceLeft}>
              <Ionicons name="planet" size={20} color={colors.primary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.cadenceLabel}>Companion Bond</Text>
                <Text style={styles.cadenceValue}>Maya · Tier 3 Sanctuary Sync</Text>
              </View>
            </View>
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>98%</Text>
            </View>
          </View>
        </View>

        {/* SECTION 1: AI Companion & Memory */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="color-wand" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}> AI Companion & Memory</Text>
            </View>
            <View style={styles.adaptiveBadge}>
              <Text style={styles.adaptiveText}>Adaptive</Text>
            </View>
          </View>
          <View style={styles.cardBlock}>
            <View style={styles.switchRow}>
              <View style={{flex: 1, paddingRight: 16}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.settingTitle}>Personalized Memory </Text>
                  <View style={styles.activeLabel}><Text style={styles.activeLabelText}>Active</Text></View>
                </View>
                <Text style={styles.settingDesc}>Maya remembers previous reflections and shared emotional states to provide continuous, empathetic context.</Text>
              </View>
              <Switch value={memoryEnabled} onValueChange={setMemoryEnabled} trackColor={{true: colors.primary}} />
            </View>

            <View style={styles.memoryListArea}>
              <View style={styles.memoryListHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="aperture" size={16} color={colors.tertiary} />
                  <Text style={styles.memoryListTitle}> Active Companion Impressions ({memories.length})</Text>
                </View>
                <TouchableOpacity><Text style={styles.reviewAllText}>Review All</Text></TouchableOpacity>
              </View>
              {memories.map(m => (
                <View key={m.id} style={styles.memoryItem}>
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8}}>
                    <View style={styles.memoryDot} />
                    <Text style={styles.memoryText} numberOfLines={1}>{m.text}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeMemory(m.id)}>
                    <Ionicons name="close" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.clearMemoryRow}>
              <Text style={styles.clearMemoryDesc}>Wish to start with a blank slate?</Text>
              <TouchableOpacity style={styles.clearMemoryBtn}>
                <Ionicons name="refresh" size={16} color={colors.error} />
                <Text style={styles.clearMemoryBtnText}> Clear AI Memory</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SECTION 2: Privacy & Emotional Data */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}> Privacy & Emotional Data</Text>
            </View>
          </View>
          <View style={styles.cardBlockMulti}>
            <View style={styles.listItem}>
              <View style={styles.listIconBox}><Ionicons name="finger-print" size={20} color={colors.primary} /></View>
              <View style={styles.listTextContent}>
                <Text style={styles.settingTitle}>Local Data Lock</Text>
                <Text style={styles.settingDesc}>Biometric or device PIN for sensitive journals</Text>
              </View>
              <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} trackColor={{true: colors.primary}} />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.listItem}>
              <View style={styles.listIconBox}><Ionicons name="download" size={20} color={colors.primary} /></View>
              <View style={styles.listTextContent}>
                <Text style={styles.settingTitle}>Download Personal Archive</Text>
                <Text style={styles.settingDesc}>Encrypted JSON & readable journal logs (GDPR)</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.listItem}>
              <View style={[styles.listIconBox, {backgroundColor: colors.errorContainer}]}><Ionicons name="trash" size={20} color={colors.error} /></View>
              <View style={styles.listTextContent}>
                <Text style={[styles.settingTitle, {color: colors.error}]}>Erase Account & Emotional Trail</Text>
                <Text style={styles.settingDesc}>Irrevocable erasure according to CCPA/GDPR</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECTION 3: Gentle Cadence */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="notifications" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}> Gentle Cadence</Text>
            </View>
          </View>
          <View style={styles.cardBlock}>
            <View style={[styles.switchRow, {paddingBottom: spacing.sm}]}>
              <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View style={[styles.listIconBox, {backgroundColor: colors.tertiaryFixed, marginRight: 12}]}><Ionicons name="sunny" size={18} color={colors.onTertiaryFixed} /></View>
                <View>
                  <Text style={styles.settingTitle}>Morning Breath & Prompt</Text>
                  <Text style={styles.settingDesc}>Gentle chime at 8:30 AM</Text>
                </View>
              </View>
              <Switch value={morningEnabled} onValueChange={setMorningEnabled} trackColor={{true: colors.primary}} />
            </View>
            <View style={[styles.switchRow, {paddingTop: spacing.sm}]}>
              <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View style={[styles.listIconBox, {backgroundColor: '#edd8fe', marginRight: 12}]}><Ionicons name="moon" size={18} color="#231531" /></View>
                <View>
                  <Text style={styles.settingTitle}>Evening Reflection Sanctuary</Text>
                  <Text style={styles.settingDesc}>Unwinding anchor at 9:00 PM</Text>
                </View>
              </View>
              <Switch value={eveningEnabled} onValueChange={setEveningEnabled} trackColor={{true: colors.primary}} />
            </View>
          </View>
        </View>

        {/* Sign Out & Version */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.signOutBtn} onPress={() => navigation.navigate('WelcomeScreen')}>
            <Ionicons name="log-out" size={18} color={colors.textMuted} />
            <Text style={styles.signOutBtnText}>Sign Out of Sanctuary</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>MINDFUL AI Version 3.4.1 (Build 2024.9) · Protected by zero-knowledge architecture</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceBase },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.gutter, paddingTop: spacing.md, paddingBottom: spacing.sm, zIndex: 10 },
  headerTop: { flex: 1 },
  headerBrand: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary, letterSpacing: 1 },
  headerTitle: { fontFamily: typography.fontFamily.serifMedium, fontSize: typography.sizes.headlineLg, color: colors.textMain },
  sosBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorContainer, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  sosBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.onErrorContainer, marginLeft: 4 },
  
  scrollContent: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.xl * 2 },
  
  identityCard: { backgroundColor: '#FFFFFF', borderRadius: radius.xl, padding: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: spacing.lg },
  identityRow: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarContainer: { position: 'relative', marginRight: spacing.md },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#c8ead9' },
  editAvatarBtn: { position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  identityDetails: { flex: 1, paddingTop: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#c8ead9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, marginRight: 8 },
  verifiedText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#133126', marginLeft: 4 },
  ageText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  nameText: { fontFamily: typography.fontFamily.serifMedium, fontSize: typography.sizes.headlineMd, color: colors.textMain },
  memberText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, marginTop: 4 },
  
  cadencePill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F2F3FF', borderRadius: radius.lg, padding: 12, marginTop: spacing.md },
  cadenceLeft: { flexDirection: 'row', alignItems: 'center' },
  cadenceLabel: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  cadenceValue: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.textMain },
  scorePill: { backgroundColor: '#c8ead9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill },
  scoreText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#2f4d40' },
  
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm, paddingHorizontal: 4 },
  sectionTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.headlineSm, color: colors.textMain },
  adaptiveBadge: { backgroundColor: '#f0dbff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  adaptiveText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#231531' },
  
  cardBlock: { backgroundColor: '#FFFFFF', borderRadius: radius.xl, padding: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardBlockMulti: { backgroundColor: '#FFFFFF', borderRadius: radius.xl, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  settingTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textMain },
  activeLabel: { backgroundColor: '#c8ead9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  activeLabelText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#2f4d40' },
  settingDesc: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  
  memoryListArea: { backgroundColor: '#F2F3FF', borderRadius: radius.lg, padding: 12, marginTop: spacing.md },
  memoryListHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  memoryListTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.textMain },
  reviewAllText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary },
  memoryItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 10, borderRadius: radius.md, marginBottom: 8 },
  memoryDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: 10 },
  memoryText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMain },
  
  clearMemoryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md, paddingTop: spacing.xs },
  clearMemoryDesc: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  clearMemoryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.md },
  clearMemoryBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.error },
  
  listItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  listIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F3FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  listTextContent: { flex: 1, paddingRight: 16 },
  divider: { height: 1, backgroundColor: '#f2f3ff' },
  
  footer: { marginTop: spacing.md, alignItems: 'center' },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F3FF', width: '100%', height: 48, borderRadius: radius.lg, marginBottom: spacing.md },
  signOutBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textMuted, marginLeft: 8 },
  versionText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 }
});

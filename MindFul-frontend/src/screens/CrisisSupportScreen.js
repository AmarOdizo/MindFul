import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

const groundingSteps = [
  { badge: "Step 1 of 5", icon: "eye", title: "Name 5 things you can see around you", desc: "Look gently at your immediate surroundings. Notice a texture, a ray of light, a shadow, or small detail nearby.", nextBtn: "Take a breath & continue to Step 2" },
  { badge: "Step 2 of 5", icon: "hand-left", title: "Name 4 things you can physically feel", desc: "Notice the weight of your feet on the floor, the fabric against your skin, or the temperature of the air.", nextBtn: "Ground deeper & go to Step 3" },
  { badge: "Step 3 of 5", icon: "ear", title: "Name 3 sounds you can hear right now", desc: "Listen for distant traffic, a gentle breeze, room humming, or your own steady breath passing through.", nextBtn: "Notice subtle senses & go to Step 4" },
  { badge: "Step 4 of 5", icon: "flower", title: "Name 2 things you can smell or enjoy", desc: "Notice fresh air, tea, a notebook, or simply breathe in slowly through your nose for four calm seconds.", nextBtn: "Almost there & go to Step 5" },
  { badge: "Step 5 of 5", icon: "happy", title: "Name 1 thing you appreciate about yourself", desc: "Honor your bravery for reaching out right now. You are doing something deeply courageous.", nextBtn: "Exercise complete & start over" }
];

export default function CrisisSupportScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleCall = (number) => Linking.openURL(`tel:${number}`);
  const handleText = (number, body) => Linking.openURL(`sms:${number}?body=${body}`);

  const step = groundingSteps[currentStep];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crisis Support</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.sosBadge}>
            <Ionicons name="heart" size={13} color="#DC2626" />
            <Text style={styles.sosBadgeText}>24/7 SOS</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Reassurance Banner */}
        <View style={styles.reassuranceBanner}>
          <View style={styles.reassuranceTopRow}>
            <View style={styles.confidentialBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.confidentialText}>24/7 CONFIDENTIAL CARE</Text>
            </View>
            <Ionicons name="shield-checkmark" size={20} color="#059669" />
          </View>
          <Text style={styles.reassuranceTitle}>You are not alone in this moment.</Text>
          <Text style={styles.reassuranceDesc}>
            If you are experiencing overwhelming distress, thinking of self-harm, or feeling unsafe, compassionate human support is completely free, private, and waiting for you right now.
          </Text>
        </View>

        {/* Immediate Lifelines */}
        <View style={styles.lifelinesSection}>
          
          {/* 988 Lifeline */}
          <View style={styles.lifelineCardPrimary}>
            <View style={styles.lifelineCardTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="heart" size={20} color="#DC2626" />
                <Text style={styles.lifelineRegionText}> UNITED STATES & CANADA</Text>
              </View>
              <View style={styles.tollFreeBadge}><Text style={styles.tollFreeText}>Toll-Free</Text></View>
            </View>
            <Text style={styles.lifelineTitle}>Suicide & Crisis Lifeline</Text>
            <Text style={styles.lifelineSub}>Free · Confidential · 24/7 · Dedicated human counselors</Text>
            <View style={styles.lifelineActionRow}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => handleCall('988')}
                activeOpacity={0.85}
              >
                <Ionicons name="call" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionText}> Call 988 Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => handleText('988', '')}
                activeOpacity={0.85}
              >
                <Ionicons name="chatbubble" size={18} color="#DC2626" />
                <Text style={styles.secondaryActionText}> Text 988</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Crisis Text Line */}
          <View style={styles.lifelineCard}>
            <View style={styles.lifelineCardTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={[styles.iconBox, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="chatbubbles" size={16} color="#7C3AED" />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.cardItemTitle}>Crisis Text Line</Text>
                  <Text style={styles.cardItemSub} numberOfLines={1}>Available across US, UK & Canada</Text>
                </View>
              </View>
              <View style={styles.smsBadge}><Text style={styles.smsText}>24/7 SMS</Text></View>
            </View>
            <Text style={styles.cardItemDesc}>Connect via discreet text message with a crisis counselor at any moment of need.</Text>
            <TouchableOpacity
              style={styles.textHomeBtn}
              onPress={() => handleText('741741', 'HOME')}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.textHomeText}>Text HOME to 741741</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Trevor Project */}
          <View style={styles.lifelineCard}>
            <View style={styles.lifelineCardTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="people" size={16} color="#059669" />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.cardItemTitle}>The Trevor Project</Text>
                  <Text style={styles.cardItemSub} numberOfLines={1}>LGBTQ Young People (Ages 13–24)</Text>
                </View>
              </View>
              <View style={styles.smsBadge}><Text style={styles.smsText}>Free · Affirming</Text></View>
            </View>
            <Text style={styles.cardItemDesc}>Trained LGBTQ-affirming crisis counselors ready to listen with deep empathy and zero judgment.</Text>
            <View style={styles.lifelineActionRow}>
              <TouchableOpacity
                style={styles.tertiaryBtn}
                onPress={() => handleCall('18664887386')}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={16} color="#059669" />
                <Text style={styles.tertiaryBtnText}> Call Counselors</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tertiaryBtn}
                onPress={() => handleText('678678', 'START')}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble" size={16} color="#059669" />
                <Text style={styles.tertiaryBtnText}> Text START</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency 911 */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyIconBox}>
              <Ionicons name="warning" size={22} color="#DC2626" />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={styles.cardItemTitle}>Immediate Physical Danger?</Text>
              <Text style={styles.cardItemSub}>If you or someone nearby needs instant medical care</Text>
            </View>
            <TouchableOpacity
              style={styles.call911Btn}
              onPress={() => handleCall('911')}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={13} color="#FFFFFF" />
              <Text style={styles.call911Text}> Call 911</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Sensory Grounding */}
        <View style={styles.groundingSection}>
          <View style={styles.groundingHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5', marginRight: 10 }]}>
                <Ionicons name="leaf" size={16} color="#059669" />
              </View>
              <View>
                <Text style={styles.cardItemTitle}>5-4-3-2-1 Sensory Grounding</Text>
                <Text style={styles.cardItemSub}>Calm your body right now</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => setCurrentStep(0)}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={13} color="#64748B" />
              <Text style={styles.resetBtnText}> Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.groundingCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.stepBadgeText}>{step.badge}</Text>
              <Ionicons name={step.icon} size={18} color="#059669" />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>

          <View style={styles.progressRow}>
            {[0, 1, 2, 3, 4].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.progressDot,
                  { backgroundColor: idx <= currentStep ? '#059669' : '#E2E8F0' },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.stepNextBtn}
            onPress={() => setCurrentStep((currentStep + 1) % 5)}
            activeOpacity={0.85}
          >
            <Text style={styles.stepNextBtnText}>{step.nextBtn}</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Offline Notice */}
        <View style={styles.offlineNotice}>
          <Ionicons name="cellular" size={16} color="#64748B" />
          <Text style={styles.offlineText}>
            Helplines operate over regular voice and SMS networks even if internet connectivity, Wi-Fi, or app services are offline.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FAF9F6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 154, 139, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.2)',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 17,
    color: '#1C2541',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  sosBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#DC2626',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  reassuranceBanner: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  reassuranceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidentialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  confidentialText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 9,
    color: '#059669',
    letterSpacing: 0.5,
  },
  reassuranceTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 18,
    color: '#1C2541',
    marginBottom: 6,
  },
  reassuranceDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: '#5C677D',
    lineHeight: 18,
  },
  lifelinesSection: {
    marginVertical: 14,
    gap: 12,
  },
  lifelineCardPrimary: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FECDD3',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lifelineCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lifelineRegionText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#991B1B',
    letterSpacing: 0.4,
  },
  tollFreeBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  tollFreeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#991B1B',
  },
  lifelineTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 20,
    color: '#991B1B',
    marginBottom: 2,
  },
  lifelineSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#B91C1C',
    marginBottom: 12,
  },
  lifelineActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryActionBtn: {
    flex: 1,
    height: 46,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryActionText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    flex: 1,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  secondaryActionText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#DC2626',
  },
  lifelineCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardItemTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14,
    color: '#1C2541',
  },
  cardItemSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  smsBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  smsText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#475569',
  },
  cardItemDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: '#5C677D',
    marginVertical: 10,
    lineHeight: 16,
  },
  textHomeBtn: {
    height: 44,
    backgroundColor: '#7A9A8B',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  textHomeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
  tertiaryBtn: {
    flex: 1,
    height: 42,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tertiaryBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#059669',
  },
  emergencyCard: {
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  emergencyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  call911Btn: {
    height: 36,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 4,
  },
  call911Text: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  groundingSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  groundingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resetBtn: {
    height: 28,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 2,
  },
  resetBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#64748B',
  },
  groundingCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10,
    color: '#059669',
    letterSpacing: 0.5,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14,
    color: '#1C2541',
    marginTop: 4,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepNextBtn: {
    height: 44,
    backgroundColor: '#7A9A8B',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stepNextBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  offlineNotice: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.15)',
  },
  offlineText: {
    flex: 1,
    marginLeft: 10,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
});

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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sos Crisis Support</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.sosBadge}>
            <Ionicons name="medical" size={14} color={colors.error} />
            <Text style={styles.sosBadgeText}>SOS</Text>
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
            <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="heart" size={24} color={colors.error} />
                <Text style={styles.lifelineRegionText}> UNITED STATES & CANADA</Text>
              </View>
              <View style={styles.tollFreeBadge}><Text style={styles.tollFreeText}>Toll-Free</Text></View>
            </View>
            <Text style={styles.lifelineTitle}>Suicide & Crisis Lifeline</Text>
            <Text style={styles.lifelineSub}>Free · Confidential · 24/7 · Dedicated human counselors</Text>
            <View style={styles.lifelineActionRow}>
              <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleCall('988')}>
                <Ionicons name="call" size={20} color={colors.onError} />
                <Text style={styles.primaryActionText}> Call 988 Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => handleText('988', '')}>
                <Ionicons name="chatbubble" size={20} color={colors.errorContainer} />
                <Text style={styles.secondaryActionText}> Text 988</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Crisis Text Line */}
          <View style={styles.lifelineCard}>
            <View style={styles.lifelineCardTop}>
              <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View style={[styles.iconBox, {backgroundColor: '#f0dbff'}]}><Ionicons name="chatbubbles" size={18} color="#231531" /></View>
                <View style={{marginLeft: 8, flex: 1}}>
                  <Text style={styles.cardItemTitle}>Crisis Text Line</Text>
                  <Text style={styles.cardItemSub} numberOfLines={1}>Available across US, UK & Canada</Text>
                </View>
              </View>
              <View style={styles.smsBadge}><Text style={styles.smsText}>24/7 SMS</Text></View>
            </View>
            <Text style={styles.cardItemDesc}>Connect via discreet text message with a crisis counselor at any moment of need.</Text>
            <TouchableOpacity style={styles.textHomeBtn} onPress={() => handleText('741741', 'HOME')}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="send" size={18} color={colors.textInverse} />
                <Text style={styles.textHomeText}> Text HOME to 741741</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
            </TouchableOpacity>
          </View>

          {/* Trevor Project */}
          <View style={styles.lifelineCard}>
            <View style={styles.lifelineCardTop}>
              <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View style={[styles.iconBox, {backgroundColor: '#c8ead9'}]}><Ionicons name="people" size={18} color="#012016" /></View>
                <View style={{marginLeft: 8, flex: 1}}>
                  <Text style={styles.cardItemTitle}>The Trevor Project</Text>
                  <Text style={styles.cardItemSub} numberOfLines={1}>LGBTQ Young People (Ages 13–24)</Text>
                </View>
              </View>
              <View style={styles.smsBadge}><Text style={styles.smsText}>Free · Affirming</Text></View>
            </View>
            <Text style={styles.cardItemDesc}>Trained LGBTQ-affirming crisis counselors ready to listen with deep empathy and zero judgment.</Text>
            <View style={styles.lifelineActionRow}>
              <TouchableOpacity style={styles.tertiaryBtn} onPress={() => handleCall('18664887386')}>
                <Ionicons name="call" size={18} color={colors.primary} />
                <Text style={styles.tertiaryBtnText}> Call Counselors</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tertiaryBtn} onPress={() => handleText('678678', 'START')}>
                <Ionicons name="chatbubble" size={18} color={colors.primary} />
                <Text style={styles.tertiaryBtnText}> Text START</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency 911 */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyIconBox}><Ionicons name="warning" size={24} color={colors.error} /></View>
            <View style={{flex: 1, paddingHorizontal: 12}}>
              <Text style={styles.cardItemTitle}>Immediate Physical Danger?</Text>
              <Text style={styles.cardItemSub}>If you or someone nearby needs instant medical care...</Text>
            </View>
            <TouchableOpacity style={styles.call911Btn} onPress={() => handleCall('911')}>
              <Ionicons name="call" size={14} color={colors.onError} />
              <Text style={styles.call911Text}> Call 911</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Sensory Grounding */}
        <View style={styles.groundingSection}>
          <View style={styles.groundingHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="leaf" size={22} color={colors.primary} />
              <View style={{marginLeft: 8}}>
                <Text style={styles.cardItemTitle}>Wait with Grounding</Text>
                <Text style={styles.cardItemSub}>Calm your body while connecting</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resetBtn} onPress={() => setCurrentStep(0)}>
              <Ionicons name="refresh" size={14} color={colors.textMain} />
              <Text style={styles.resetBtnText}> Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.groundingCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.stepBadgeText}>{step.badge}</Text>
              <Ionicons name={step.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>

          <View style={styles.progressRow}>
            {[0, 1, 2, 3, 4].map(idx => (
              <View key={idx} style={[styles.progressDot, {backgroundColor: idx <= currentStep ? colors.primary : '#dbe1ff'}]} />
            ))}
          </View>

          <TouchableOpacity style={styles.stepNextBtn} onPress={() => setCurrentStep((currentStep + 1) % 5)}>
            <Text style={styles.stepNextBtnText}>{step.nextBtn}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.primaryContainerText} />
          </TouchableOpacity>
        </View>

        {/* Youth & Teen Sanctuary Card */}
        <View style={styles.youthCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
            <Ionicons name="sunny" size={22} color={colors.secondary} />
            <Text style={[styles.cardItemTitle, {marginLeft: 8}]}>Youth & Teen Guidance</Text>
          </View>
          <Text style={styles.reassuranceDesc}>Talking to a trusted adult, family member, school counselor, or medical professional can bring deep relief. You do not have to carry heavy weights alone.</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop' }} style={styles.youthImage} />
        </View>

        {/* Offline Notice */}
        <View style={styles.offlineNotice}>
          <Ionicons name="cellular" size={18} color={colors.textMuted} />
          <Text style={styles.offlineText}>Helplines operate over regular cellular voice and SMS networks even if internet connectivity, Wi-Fi, or app services are currently offline.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceBase },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.gutter, height: 56 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.headlineSm, color: colors.textMain },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  sosBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorContainer, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  sosBadgeText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.onErrorContainer, marginLeft: 4 },
  
  scrollContent: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.xl * 2 },
  
  reassuranceBanner: { backgroundColor: '#f2f3ff', padding: spacing.lg, borderRadius: radius.xl, marginVertical: spacing.sm },
  reassuranceTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  confidentialBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#edd8fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  pulsingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 6 },
  confidentialText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#1f301a', letterSpacing: 0.5 },
  reassuranceTitle: { fontFamily: typography.fontFamily.serifMedium, fontSize: typography.sizes.headlineSm, color: colors.textMain, marginBottom: 8 },
  reassuranceDesc: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodyMd, color: colors.textMuted, lineHeight: 24 },
  
  lifelinesSection: { marginVertical: spacing.md, gap: spacing.md },
  
  lifelineCardPrimary: { backgroundColor: colors.errorContainer, padding: spacing.lg, borderRadius: radius.xl, shadowColor: colors.error, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  lifelineCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  lifelineRegionText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.onErrorContainer, letterSpacing: 0.5 },
  tollFreeBadge: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  tollFreeText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: 11, color: colors.textMain },
  lifelineTitle: { fontFamily: typography.fontFamily.serifMedium, fontSize: typography.sizes.headlineMd, color: colors.onErrorContainer },
  lifelineSub: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: 'rgba(147,0,10,0.9)', marginBottom: 16 },
  lifelineActionRow: { flexDirection: 'row', gap: 10 },
  primaryActionBtn: { flex: 1, height: 56, backgroundColor: colors.error, borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryActionText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.onError },
  secondaryActionBtn: { flex: 1, height: 56, backgroundColor: '#FFFFFF', borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.onErrorContainer },
  
  lifelineCard: { backgroundColor: '#FFFFFF', padding: spacing.lg, borderRadius: radius.xl, shadowColor: colors.primary, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardItemTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.headlineSm, color: colors.textMain },
  cardItemSub: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  smsBadge: { backgroundColor: '#ebedff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  smsText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.textMain },
  cardItemDesc: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, marginVertical: 12 },
  
  textHomeBtn: { height: 48, backgroundColor: colors.primary, borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  textHomeText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textInverse },
  tertiaryBtn: { flex: 1, height: 48, backgroundColor: '#e3e7ff', borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  tertiaryBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textMain },
  
  emergencyCard: { backgroundColor: '#ebedff', padding: spacing.md, borderRadius: radius.xl, flexDirection: 'row', alignItems: 'center' },
  emergencyIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(186,26,26,0.1)', justifyContent: 'center', alignItems: 'center' },
  call911Btn: { height: 40, backgroundColor: colors.error, borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  call911Text: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.onError },
  
  groundingSection: { backgroundColor: '#FFFFFF', padding: spacing.lg, borderRadius: radius.xl, marginVertical: spacing.md, shadowColor: colors.primary, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  groundingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resetBtn: { height: 32, backgroundColor: '#ebedff', borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  resetBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.textMain },
  groundingCard: { backgroundColor: '#f2f3ff', padding: spacing.md, borderRadius: radius.lg, marginBottom: 12 },
  stepBadgeText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  stepTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.headlineSm, color: colors.textMain, marginTop: 4, marginBottom: 8 },
  stepDesc: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  progressDot: { flex: 1, height: 6, borderRadius: 3 },
  stepNextBtn: { height: 48, backgroundColor: '#7a9a8b', borderRadius: radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepNextBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: '#133126', marginRight: 8 },
  
  youthCard: { backgroundColor: '#f2f3ff', padding: spacing.lg, borderRadius: radius.xl, marginVertical: spacing.md },
  youthImage: { width: '100%', height: 140, borderRadius: radius.lg, marginTop: 16 },
  
  offlineNotice: { backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: radius.xl, flexDirection: 'row', alignItems: 'flex-start', marginVertical: spacing.sm },
  offlineText: { flex: 1, marginLeft: 12, fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, lineHeight: 20 }
});

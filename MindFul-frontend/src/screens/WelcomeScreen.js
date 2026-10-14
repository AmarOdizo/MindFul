import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Top Ambient Glow Aura & Brand Emblem */}
        <View style={styles.brandSection}>
          <View style={styles.glowAura1} />
          <View style={styles.glowAura2} />
          
          <View style={styles.emblemContainer}>
            <View style={styles.emblemInner}>
              <Ionicons name="leaf" size={32} color={colors.primary} />
            </View>
          </View>
          
          <View style={styles.titleArea}>
            <View style={styles.sanctuaryPill}>
              <Text style={styles.sanctuaryPillText}>EMOTIONAL SANCTUARY</Text>
            </View>
            <Text style={styles.mainTitle}>MINDFUL</Text>
            <Text style={styles.subtitleItalic}>“A little more peace, every day.”</Text>
            <Text style={styles.descText}>
              An empathetic, science-backed emotional wellness sanctuary to help you navigate life with clarity and gentle presence.
            </Text>
          </View>
        </View>

        {/* Calming Scenic Sanctuary Illustration Card */}
        <View style={styles.illustrationCard}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.imageBg}
            imageStyle={{ borderRadius: radius.xl }}
          >
            <View style={styles.imageOverlay} />
            <View style={styles.imageContent}>
              <View style={styles.imageLeft}>
                <Ionicons name="aperture" size={18} color="#dbe1ff" />
                <Text style={styles.imageLabel}> Daily Restorative Space</Text>
              </View>
              <View style={styles.imageRightPill}>
                <Text style={styles.imageRightPillText}>Quiet Pavilion</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Feature Highlights Pill Cards */}
        <View style={styles.featuresList}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, {backgroundColor: '#c8ead9'}]}>
              <Ionicons name="heart" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>Empathetic AI Companion</Text>
              <Text style={styles.featureDesc} numberOfLines={1}>Available 24/7 for compassionate, unhurried listening</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, {backgroundColor: '#edd8fe'}]}>
              <Ionicons name="color-filter-outline" size={20} color="#685878" />
            </View>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>Mood Insights & Guided Breaths</Text>
              <Text style={styles.featureDesc} numberOfLines={1}>Personalized emotional check-ins tuned to your rhythm</Text>
            </View>
          </View>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, {backgroundColor: '#d3e9c8'}]}>
              <Ionicons name="lock-closed" size={20} color="#516449" />
            </View>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>Safe, Private & Non-judgmental</Text>
              <Text style={styles.featureDesc} numberOfLines={1}>Your thoughts remain completely confidential and secure</Text>
            </View>
          </View>
        </View>

        {/* Action Deck */}
        <View style={styles.actionDeck}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryBtnText}>Get Started • Create Account</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.textInverse} style={{marginLeft: 8}} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryBtnText}>I already have an account • Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Safety & Medical Clarification Notice */}
        <View style={styles.safetyNotice}>
          <Ionicons name="shield-checkmark" size={14} color={colors.textMuted} />
          <Text style={styles.safetyNoticeText}>
            MINDFUL is an AI wellness companion, not a medical or emergency service.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceBase },
  container: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.xl },
  
  brandSection: { alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xl, paddingBottom: spacing.sm, position: 'relative' },
  glowAura1: { position: 'absolute', top: -16, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(211,191,228,0.4)', blurRadius: 20 },
  glowAura2: { position: 'absolute', top: -4, width: 112, height: 112, borderRadius: 56, backgroundColor: 'rgba(200,234,217,0.5)', blurRadius: 10 },
  emblemContainer: { zIndex: 10, padding: 8, borderRadius: 50, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  emblemInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f2f3ff', alignItems: 'center', justifyContent: 'center' },
  
  titleArea: { alignItems: 'center', marginTop: spacing.lg, zIndex: 10 },
  sanctuaryPill: { backgroundColor: '#edd8fe', paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill, marginBottom: 8 },
  sanctuaryPillText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#6d5c7c', letterSpacing: 1 },
  mainTitle: { fontFamily: typography.fontFamily.serifMedium, fontSize: typography.sizes.displayLgMobile, color: colors.textMain, letterSpacing: -0.5 },
  subtitleItalic: { fontFamily: typography.fontFamily.serifMedium, fontStyle: 'italic', fontSize: typography.sizes.headlineSm, color: colors.primary, marginTop: 4 },
  descText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, textAlign: 'center', marginTop: 12, paddingHorizontal: 16, lineHeight: 22 },
  
  illustrationCard: { width: '100%', height: 176, marginVertical: spacing.md, borderRadius: radius.xl, overflow: 'hidden', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  imageBg: { width: '100%', height: '100%', justifyContent: 'flex-end', padding: spacing.md },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(38,47,76,0.3)' },
  imageContent: { zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  imageLeft: { flexDirection: 'row', alignItems: 'center' },
  imageLabel: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: '#FFFFFF', letterSpacing: 0.5 },
  imageRightPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  imageRightPillText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: '#FFFFFF' },
  
  featuresList: { marginVertical: spacing.sm, gap: 10 },
  featureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: radius.xl, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  featureIconBox: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  featureTextContent: { flex: 1 },
  featureTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textMain },
  featureDesc: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, marginTop: 2 },
  
  actionDeck: { marginTop: spacing.md, gap: 10 },
  primaryBtn: { width: '100%', height: 48, borderRadius: radius.lg, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textInverse },
  secondaryBtn: { width: '100%', height: 48, borderRadius: radius.lg, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  secondaryBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelLg, color: colors.textMain },
  
  safetyNotice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, paddingHorizontal: 8 },
  safetyNoticeText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted, marginLeft: 6, textAlign: 'center' }
});

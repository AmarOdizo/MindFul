import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function WelcomeScreen({ navigation }) {
  const { height } = useWindowDimensions();
  const isCompact = height < 700;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceBase} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Brand Emblem & Minimalist Header */}
        <View style={styles.headerSection}>
          <View style={styles.emblemAura}>
            <View style={styles.emblemCircle}>
              <Ionicons name="leaf" size={28} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.appName}>MindFul</Text>
          <Text style={styles.tagline}>Peace of mind, one breath at a time</Text>
        </View>

        {/* Calming Visual Hero Card */}
        <View style={[styles.heroCard, isCompact && styles.heroCardCompact]}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop',
            }}
            style={styles.heroImage}
            imageStyle={{ borderRadius: radius.xl }}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={13} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>Daily Emotional Sanctuary</Text>
            </View>
          </ImageBackground>
        </View>

        {/* 3 Sleek Quick Value Badges */}
        <View style={styles.highlightsRow}>
          <View style={styles.highlightPill}>
            <View style={[styles.pillIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="leaf-outline" size={13} color={colors.primary} />
            </View>
            <Text style={styles.highlightText} numberOfLines={1}>4-7-8 Rhythm</Text>
          </View>
          <View style={styles.highlightPill}>
            <View style={[styles.pillIconBox, { backgroundColor: colors.amberLight }]}>
              <Ionicons name="journal-outline" size={13} color={colors.amber} />
            </View>
            <Text style={styles.highlightText} numberOfLines={1}>Daily Journal</Text>
          </View>
          <View style={styles.highlightPill}>
            <View style={[styles.pillIconBox, { backgroundColor: colors.secondaryLight }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={13} color={colors.secondary} />
            </View>
            <Text style={styles.highlightText} numberOfLines={1}>Maya Guide</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Begin Sanctuary Journey</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.secondaryBtnText}>
              Already have an account? <Text style={styles.secondaryBtnBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Minimal Confidentiality / Trust Footer */}
        <View style={styles.trustFooter}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.textMuted} />
          <Text style={styles.trustText}>100% Private • End-to-End Encrypted Sanctuary</Text>
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
  container: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  /* Header Section */
  headerSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  emblemAura: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  emblemCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.level1,
  },
  appName: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.displayMd,
    color: colors.textMain,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* Hero Card */
  heroCard: {
    width: '100%',
    height: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginVertical: spacing.sm,
    ...shadows.level2,
  },
  heroCardCompact: {
    height: 140,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderRadius: radius.xl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  heroBadgeText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* 3 Value Pills */
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: spacing.md,
  },
  highlightPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceRaised,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.level1,
  },
  pillIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: colors.textMain,
  },

  /* Action Area */
  actionSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  primaryBtn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.level3,
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm,
    color: colors.textMuted,
  },
  secondaryBtnBold: {
    fontFamily: typography.fontFamily.sansSemiBold,
    color: colors.primary,
  },

  /* Trust Footer */
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: spacing.xs,
    paddingBottom: 2,
  },
  trustText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
});

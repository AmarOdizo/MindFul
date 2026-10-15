import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Emblem & Minimalist Header */}
        <View style={styles.headerSection}>
          <View style={styles.emblemAura}>
            <View style={styles.emblemCircle}>
              <Ionicons name="leaf" size={30} color="#059669" />
            </View>
          </View>

          <Text style={styles.appName}>MindFul</Text>
          <Text style={styles.tagline}>Peace of mind, one breath at a time</Text>
        </View>

        {/* Calming Visual Hero Card */}
        <View style={styles.heroCard}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop',
            }}
            style={styles.heroImage}
            imageStyle={{ borderRadius: 20 }}
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
            <Ionicons name="leaf-outline" size={14} color="#059669" />
            <Text style={styles.highlightText}>4-7-8 Breathing</Text>
          </View>
          <View style={styles.highlightPill}>
            <Ionicons name="journal-outline" size={14} color="#D97706" />
            <Text style={styles.highlightText}>Daily Journal</Text>
          </View>
          <View style={styles.highlightPill}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color="#7C3AED" />
            <Text style={styles.highlightText}>Maya AI Guide</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>
              Already have an account? <Text style={styles.secondaryBtnBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Minimal Confidentiality / Trust Footer */}
        <View style={styles.trustFooter}>
          <Ionicons name="shield-checkmark-outline" size={12} color="#94A3B8" />
          <Text style={styles.trustText}>100% Private & Confidential Sanctuary</Text>
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
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  /* Header Section */
  headerSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  emblemAura: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  emblemCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  appName: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 32,
    fontWeight: '700',
    color: '#1C2541',
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: '#5C677D',
    marginTop: 3,
  },

  /* Hero Card */
  heroCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 37, 65, 0.28)',
    borderRadius: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  /* 3 Value Pills */
  highlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  highlightPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1C2541',
  },

  /* Action Area */
  actionSection: {
    marginTop: 10,
    marginBottom: 8,
    gap: 10,
  },
  primaryBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    color: '#64748B',
  },
  secondaryBtnBold: {
    fontWeight: '700',
    color: '#059669',
  },

  /* Trust Footer */
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 6,
    paddingBottom: 4,
  },
  trustText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import TopAppBar from '../components/TopAppBar';
import Card from '../components/Card';
import Button from '../components/Button';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TopAppBar 
        title="Good morning, Sarah" 
        subtitle="YOUR SANCTUARY" 
        onProfilePress={() => navigation.navigate('Profile')}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Today's Journey</Text>

        {/* Daily Check-in Widget */}
        <Card style={styles.cardMargin}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <Ionicons name="heart-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>Emotional Check-in</Text>
          </View>
          <Text style={styles.cardBody}>
            Take a moment to reflect on how you're feeling today. Acknowledging your emotions is the first step to peace.
          </Text>
          <Button 
            title="Log Mood" 
            variant="primary" 
            onPress={() => navigation.navigate('MoodCheckin')} 
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Meditation Widget */}
        <Card style={styles.cardMargin}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1, paddingRight: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                <Ionicons name="timer-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.cardTitle, { marginBottom: 0 }]}>4-7-8 Deep Calm Breathing</Text>
              </View>
              <Text style={[styles.cardBody, { color: colors.primary, fontFamily: typography.fontFamily.sansSemiBold, fontSize: 14 }]}>
                5 min • Vagus Nerve Tone
              </Text>
            </View>
            <View style={styles.imageBox}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=300&auto=format&fit=crop' }} 
                style={styles.thumbnail} 
              />
            </View>
          </View>
          <Text style={[styles.cardBody, { marginTop: spacing.sm, fontSize: 14 }]}>
            Regulates the autonomic nervous system and gently calms rapid heart rate through extended exhalations.
          </Text>
          <Button 
            title="Begin" 
            variant="secondary" 
            onPress={() => navigation.navigate('Activities')} 
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Recent Journal Widget */}
        <Card style={styles.cardMargin}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <Ionicons name="book-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { marginBottom: 0 }]}>Private Journal</Text>
          </View>
          <Text style={styles.cardBody}>
            Your mind is a garden. Plant positive thoughts today.
          </Text>
          <Button 
            title="Write an Entry" 
            variant="ghost" 
            onPress={() => navigation.navigate('Journal')} 
            style={{ marginTop: spacing.md, alignSelf: 'flex-start', paddingHorizontal: 0 }}
          />
        </Card>

        {/* Crisis Support Widget */}
        <Card style={[styles.cardMargin, { backgroundColor: '#FFF5F5', borderColor: '#FFE4E6' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <Ionicons name="medkit-outline" size={24} color="#E11D48" style={{ marginRight: 8 }} />
            <Text style={[styles.cardTitle, { color: '#E11D48', marginBottom: 0 }]}>Need Immediate Help?</Text>
          </View>
          <Text style={styles.cardBody}>
            You are not alone. Access emergency resources and professional support instantly.
          </Text>
          <Button 
            title="Crisis Support" 
            variant="secondary" 
            onPress={() => navigation.navigate('CrisisSupport')} 
            style={{ marginTop: spacing.md, borderColor: '#FDA4AF' }}
          />
        </Card>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.surfaceBase, // Alabaster linen background
  },
  scrollContent: {
    paddingHorizontal: spacing.gutter, // 20px margin
    paddingTop: 140, // Space for absolute TopAppBar
    paddingBottom: 40, // Reduced since TabNavigator now handles safe area
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm, // 20px
    color: colors.textMain,
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  cardMargin: {
    marginBottom: spacing.lg, // generous vertical padding
  },
  cardTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineSm,
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  cardBody: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodyMd, // 16px
    color: colors.textMuted,
    lineHeight: 24, // High vertical symmetry
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceDim,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  }
});

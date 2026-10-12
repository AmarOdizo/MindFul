import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../theme';

export default function TopAppBar({ 
  title, 
  subtitle, 
  onProfilePress,
  avatarUrl = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <BlurView intensity={85} tint="light" style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Pressable onPress={onProfilePress} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </Pressable>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(250, 249, 246, 0.7)', // Translucent alabaster base
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodySm, // 14px
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: typography.sizes.headlineMd, // 24px
    color: colors.textMain,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill, // 9999px
    borderWidth: 1.5,
    borderColor: 'rgba(122, 154, 139, 0.25)', // Subtle sage border
  }
});

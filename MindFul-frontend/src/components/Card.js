import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows } from '../theme';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised, // #FFFFFF
    borderRadius: radius.lg, // 16px (1rem)
    padding: spacing.gutter, // 20px (1.25rem)
    ...shadows.level1, // Custom ambient elevation
    marginBottom: spacing.md,
    width: '100%',
  },
});

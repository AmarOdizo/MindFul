import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, typography, radius, shadows } from '../theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  style, 
  textStyle,
  disabled,
  loading = false,
  icon,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primaryBase,
        variant === 'primary' && pressed && styles.primaryPressed,
        
        variant === 'secondary' && styles.secondaryBase,
        variant === 'secondary' && pressed && styles.secondaryPressed,
        
        variant === 'ghost' && styles.ghostBase,
        variant === 'danger' && styles.dangerBase,
        
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : colors.primary} 
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconBox}>{icon}</View> : null}
          <Text
            style={[
              styles.textBase,
              variant === 'primary' && styles.primaryText,
              variant === 'secondary' && styles.secondaryText,
              variant === 'ghost' && styles.ghostText,
              variant === 'danger' && styles.dangerText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconBox: {
    marginRight: 2,
  },
  textBase: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodyMd,
    letterSpacing: 0.2,
  },
  
  // Primary Button
  primaryBase: {
    backgroundColor: colors.primary,
    ...shadows.level3,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  primaryText: {
    color: '#FFFFFF',
  },
  
  // Secondary Button
  secondaryBase: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.level1,
  },
  secondaryPressed: {
    backgroundColor: colors.surfaceHover,
  },
  secondaryText: {
    color: colors.textMain,
  },
  
  // Ghost Button
  ghostBase: {
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
  },
  ghostText: {
    color: colors.textMuted,
  },

  // Danger Button
  dangerBase: {
    backgroundColor: colors.error,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  
  disabled: {
    opacity: 0.55,
  },
});

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  style, 
  textStyle,
  disabled 
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primaryBase,
        variant === 'primary' && pressed && styles.primaryPressed,
        
        variant === 'secondary' && styles.secondaryBase,
        variant === 'secondary' && pressed && styles.secondaryPressed,
        
        variant === 'ghost' && styles.ghostBase,
        
        disabled && styles.disabled,
        style,
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.textBase,
            variant === 'primary' && styles.primaryText,
            variant === 'secondary' && styles.secondaryText,
            variant === 'ghost' && styles.ghostText,
            variant === 'ghost' && pressed && styles.ghostTextPressed,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md, // 8px (0.5rem)
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textBase: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg, // 14px
    letterSpacing: 0.14, // 0.01em approx
  },
  
  // Primary Button
  primaryBase: {
    backgroundColor: colors.primary, // #7A9A8B
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark, // #688678
  },
  primaryText: {
    color: colors.onPrimary, // #ffffff
  },
  
  // Secondary Button
  secondaryBase: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.borderMedium, // rgba(122, 154, 139, 0.3)
  },
  secondaryPressed: {
    backgroundColor: 'rgba(122, 154, 139, 0.08)',
  },
  secondaryText: {
    color: colors.textMain, // #1C2541
  },
  
  // Ghost / Tertiary Button
  ghostBase: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  ghostText: {
    color: colors.textMuted, // #5C677D
  },
  ghostTextPressed: {
    textDecorationLine: 'underline',
  },
  
  disabled: {
    opacity: 0.6,
  },
});

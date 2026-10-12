import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme';

export default function Chip({ 
  label, 
  selected = false, 
  onPress,
  style
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        selected ? styles.selectedBase : styles.unselectedBase,
        style
      ]}
    >
      <Text
        style={[
          styles.textBase,
          selected ? styles.selectedText : styles.unselectedText
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill, // 9999px (full rounding)
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  unselectedBase: {
    backgroundColor: colors.surfaceSubtle, // #F4F6F4
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedBase: {
    backgroundColor: '#EDE7F6', // Subtle purple/lavender background for selected chips
    borderWidth: 1,
    borderColor: colors.secondary, // #8D7B9D (Soft mineral lavender)
  },
  textBase: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.bodySm, // 14px
  },
  unselectedText: {
    color: colors.textMuted, // #5C677D
  },
  selectedText: {
    color: colors.secondary, // #8D7B9D
  },
});

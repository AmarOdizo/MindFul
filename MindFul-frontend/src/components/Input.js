import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius, spacing } from '../theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  error,
  style,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={colors.primary}
          {...props}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: typography.sizes.labelLg,
    color: colors.textMain,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    backgroundColor: colors.surfaceBase, // #FAF9F6
    borderRadius: radius.md, // 0.5rem
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.25)', // Subtle sage border
  },
  inputWrapperFocused: {
    borderColor: colors.primary, // #7A9A8B
    // Soft 3px outer glow equivalent in React Native (shadow)
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2, // Slight elevation on Android to mimic glow
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  input: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.bodyMd,
    color: colors.textMain,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top', // For Android
  },
  errorText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: typography.sizes.labelMd,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

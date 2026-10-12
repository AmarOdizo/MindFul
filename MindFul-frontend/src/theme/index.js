export const colors = {
  // Brand
  primary: '#7A9A8B', // Muted botanical sage
  primaryDark: '#688678', // Hover/Active
  secondary: '#8D7B9D', // Soft mineral lavender
  tertiary: '#A3B899', // Warm herbal mist
  neutral: '#1C2541', // Deep midnight slate
  
  // Surfaces
  surfaceBase: '#FAF9F6', // Alabaster linen background
  surfaceRaised: '#FFFFFF', // Elevated cards
  surfaceSubtle: '#F4F6F4', // Inactive fields/segmented containers
  
  // Text
  textMain: '#1C2541',
  textMuted: '#5C677D',
  textInverse: '#FFFFFF',
  
  // Semantic
  error: '#ba1a1a',
  success: '#A3B899', // using tertiary as organic progress
  
  // Borders & Outlines
  borderLight: 'rgba(122, 154, 139, 0.15)', // Ultra-subtle border
  borderMedium: 'rgba(122, 154, 139, 0.3)', 
};

export const typography = {
  fontFamily: {
    serifRegular: 'Newsreader_400Regular',
    serifMedium: 'Newsreader_500Medium',
    sansRegular: 'Manrope_400Regular',
    sansSemiBold: 'Manrope_600SemiBold',
  },
  sizes: {
    displayLg: 40,
    displayLgMobile: 32,
    headlineLg: 28,
    headlineMd: 24,
    headlineSm: 20,
    bodyLg: 18,
    bodyMd: 16,
    bodySm: 14,
    labelLg: 14,
    labelMd: 12,
    labelSm: 11,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  gutter: 20, // 1.25rem screen margins
};

export const radius = {
  sm: 4,     // Checkboxes
  md: 8,     // Standard Elements, Inputs, Buttons
  lg: 16,    // Cards & Sheets
  xl: 24,
  pill: 9999, // Pill Elements
};

export const shadows = {
  level1: {
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3, // Android equivalent
  },
  level2: {
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 8,
  },
};

export const colors = {
  // Brand & Accent Palette
  primary: '#059669', // Mindful Emerald - primary brand color
  primaryDark: '#047857', // Hover / Pressed primary
  primaryLight: '#ECFDF5', // Tinted container background
  primaryBorder: '#A7F3D0', // Subdued outline
  onPrimary: '#FFFFFF',

  secondary: '#7C3AED', // Deep Lavender / Amethyst - contemplative reflections
  secondaryDark: '#6D28D9',
  secondaryLight: '#F5F3FF',
  secondaryBorder: '#DDD6FE',
  onSecondary: '#FFFFFF',

  amber: '#D97706', // Warm Amber / Sunlight - gratitude & joyful moods
  amberLight: '#FFFBEB',
  amberBorder: '#FDE68A',

  blue: '#2563EB', // Serene Water - peace & gentle release
  blueLight: '#EFF6FF',
  blueBorder: '#BFDBFE',

  rose: '#E11D48', // Warm Coral - vibrant energy & crisis alerts
  roseLight: '#FFF1F2',
  roseBorder: '#FECDD3',

  neutral: '#1C2541', // Deep midnight slate

  // Surfaces & Backgrounds
  surfaceBase: '#FAF9F6', // Warm Alabaster canvas
  surfaceRaised: '#FFFFFF', // Elevated cards & modals
  surfaceSubtle: '#F8FAFC', // Input fields & inactive containers
  surfaceHover: '#F1F5F9', // Interactive hover state

  // Text Hierarchy (WCAG AAA / AA accessible contrast)
  textMain: '#0F172A', // Slate 900 - high contrast primary headings & text
  textSecondary: '#334155', // Slate 700 - readable body text
  textMuted: '#64748B', // Slate 500 - secondary labels & timestamps (contrast > 4.5:1)
  textSubtle: '#94A3B8', // Slate 400 - decorative hints & borders
  textInverse: '#FFFFFF',

  // Semantic Feedback
  success: '#059669',
  successLight: '#ECFDF5',
  successBorder: '#A7F3D0',

  warning: '#D97706',
  warningLight: '#FFFBEB',
  warningBorder: '#FDE68A',

  error: '#DC2626',
  errorLight: '#FEE2E2',
  errorBorder: '#FCA5A5',

  info: '#2563EB',
  infoLight: '#EFF6FF',
  infoBorder: '#BFDBFE',

  // Outlines & Dividers
  borderLight: 'rgba(100, 116, 139, 0.12)', // Clean ultra-subtle card border
  borderMedium: 'rgba(100, 116, 139, 0.22)',
  borderFocus: '#059669',
};

export const typography = {
  fontFamily: {
    serifRegular: 'Newsreader_400Regular',
    serifMedium: 'Newsreader_500Medium',
    sansRegular: 'Manrope_400Regular',
    sansSemiBold: 'Manrope_600SemiBold',
  },
  sizes: {
    displayLg: 34,
    displayMd: 28,
    headlineLg: 24,
    headlineMd: 20,
    headlineSm: 18,
    bodyLg: 16,
    bodyMd: 14,
    bodySm: 13,
    labelLg: 13,
    labelMd: 12,
    labelSm: 11,
  },
  lineHeights: {
    displayLg: 40,
    headlineLg: 30,
    headlineMd: 26,
    bodyLg: 24,
    bodyMd: 20,
    bodySm: 18,
  },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  gutter: 20, // Screen margin
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
};

export const shadows = {
  level1: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  level2: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  level3: {
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
};

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
};

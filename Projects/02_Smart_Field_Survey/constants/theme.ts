/**
 * Smart Field Survey — Design Tokens
 * Centralized color, typography, and spacing constants.
 */

import { Platform } from 'react-native';

// ─── Brand Palette ──────────────────────────────────────────────────────────
export const Palette = {
  // Primary indigo
  primary:   '#4F46E5',
  primaryDk: '#3730A3',
  primaryLt: '#EEF2FF',

  // Accent emerald
  accent:    '#10B981',
  accentDk:  '#059669',
  accentLt:  '#D1FAE5',

  // Neutrals
  ink:       '#0F172A',
  inkMid:    '#334155',
  inkSoft:   '#64748B',
  border:    '#E2E8F0',
  surface:   '#F8FAFC',
  white:     '#FFFFFF',

  // Semantic
  success:   '#16A34A',
  warning:   '#D97706',
  danger:    '#DC2626',
  info:      '#0EA5E9',
};

// ─── Theme (used by navigation) ─────────────────────────────────────────────
const tintColorLight = Palette.primary;
const tintColorDark  = '#A5B4FC';

export const Colors = {
  light: {
    text:            Palette.ink,
    background:      Palette.surface,
    tint:            tintColorLight,
    icon:            Palette.inkSoft,
    tabIconDefault:  Palette.inkSoft,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text:            '#ECEDEE',
    background:      '#151718',
    tint:            tintColorDark,
    icon:            '#9BA1A6',
    tabIconDefault:  '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// ─── Typography ──────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─── Border Radius ───────────────────────────────────────────────────────────
export const Radius = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   28,
  full: 9999,
};

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const Shadow = {
  sm: {
    shadowColor:   '#94A3B8',
    shadowOpacity: 0.12,
    shadowRadius:  6,
    shadowOffset:  { width: 0, height: 2 },
    elevation:     2,
  },
  md: {
    shadowColor:   '#94A3B8',
    shadowOpacity: 0.18,
    shadowRadius:  12,
    shadowOffset:  { width: 0, height: 4 },
    elevation:     4,
  },
  lg: {
    shadowColor:   '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius:  20,
    shadowOffset:  { width: 0, height: 8 },
    elevation:     10,
  },
};

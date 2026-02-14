/**
 * Theme constants for the BookingSystem app
 */

export const Colors = {
  light: {
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    secondary: '#EC4899', // Pink
    background: '#FFFFFF',
    card: '#F9FAFB',
    border: '#E5E7EB',
    text: '#111827',
    textSecondary: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    disabled: '#D1D5DB',
  },
  dark: {
    primary: '#818CF8',
    primaryDark: '#6366F1',
    secondary: '#F472B6',
    background: '#111827',
    card: '#1F2937',
    border: '#374151',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    disabled: '#4B5563',
  },
};

export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'Courier',
  rounded: 'System',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

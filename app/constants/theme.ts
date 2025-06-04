import { StyleSheet } from 'react-native';

// Colors
export const COLORS = {
  primary: 'rgb(141 43 145)',
  primaryVariant: 'rgb(111 33 115)',
  secondary: '#03DAC6',
  secondaryVariant: '#018786',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.onPrimary,
  },
};

// Container Styles
export const CONTAINER = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

// Button Styles
export const BUTTONS = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    elevation: 2,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    elevation: 2,
  },
  text: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});

// Layout Helpers
export const LAYOUT = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  flex: {
    flex: 1,
  },
});

export const theme = {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  container: CONTAINER,
  buttons: BUTTONS,
  layout: LAYOUT,
};

export default theme; 
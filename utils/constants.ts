export const constants = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  sizing: {
    iconSm: 16,
    iconMd: 24,
    iconLg: 32,
    bubbleSize: 56, // Size of the floating bubble
  },
  animation: {
    durationShort: 200,
    durationMedium: 300,
    durationLong: 500,
  },
  zIndex: {
    modal: 1000,
    overlay: 2000,
  }
};

export type ConstantsType = typeof constants;

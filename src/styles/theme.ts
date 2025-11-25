const colors = {
  primary400: "#2B64C9",
  primary300: "#1172FF",
  primary: "#3794FD",
  primary100: "#548AED",

  black: "#000000",
  white: "#FFFFFF",
  neutral600: "#241F1F",
  neutral500: "#5E5E6E",
  neutral400: "#9191A1",
  neutral300: "#C8C9CF",
  neutral200: "#E4E4E6",
  neutral100: "#F8F8F8",

  background500: "#E8EFF5",
  background400: "#F8F9FD",
  background300: "#F4F8FB",
  background50: "#F9F9F9",

  modalBackground: "#0000004D",
  selected: "#1172FF1A",

  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",

  textPrimary: "#1A191E",
  textSecondary: "#474752",
  textTertiary: "#9191A1",
  textBlue: "#2B64C9",
  textWhite: "#FFFFFF",
} as const;

const borderRadius = {
  none: 0,
  s: 5,
  md: 10,
  lg: 20,
  xl: 30,
} as const;

const typography = {
  fontFamily: {
    regular: "Pretendard-Regular",
    bold: "Pretendard-Bold",
    semiBold: "Pretendard-SemiBold",
    medium: "Pretendard-Medium",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22,
    xxxl: 24,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1,
    normal: 1.5,
    relaxed: 2,
  },
} as const;

const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 40,
  xxl: 50,
} as const;

const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sightList: {
    shadowColor: "#F8F9FD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  docent: {
    shadowColor: "#E8EFF5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  button: {
    shadowColor: "#E8EFF5",
    shadowOpacity: 0.04,
  },
} as const;

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;

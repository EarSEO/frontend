import { SIGHTTHEME } from "@/constants/sightTheme";

export const getThemeName = (code?: string) => {
  return SIGHTTHEME.find((theme) => theme.code === code)?.koName ?? "";
};

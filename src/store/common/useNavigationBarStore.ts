import { create } from "zustand";

interface NavigationBarStore {
  isNavigationBarHidden: boolean;
  setNavigationBarHidden: (hidden: boolean) => void;
}

export const useNavigationBarStore = create<NavigationBarStore>((set) => ({
  isNavigationBarHidden: false,
  setNavigationBarHidden: (hidden) => set({ isNavigationBarHidden: hidden }),
}));

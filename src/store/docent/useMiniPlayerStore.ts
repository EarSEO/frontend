import { create } from "zustand";

import { useAudioPlayerStore } from "@/store/docent/useAudioPlayerStore";

interface MiniPlayerStore {
  enableLyrics: boolean;
  enableModal: boolean;

  toggleLyrics: (state?: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useMiniPlayerStore = create<MiniPlayerStore>((set, get) => ({
  enableLyrics: false,
  enableModal: false,

  toggleLyrics: (state?: boolean): void => {
    set({ enableLyrics: state ?? !get().enableLyrics });
    if (get().enableLyrics) useAudioPlayerStore.getState().setDocentScript();
  },
  openModal: (): void => {
    set({ enableModal: true });
  },
  closeModal: (): void => {
    set({ enableModal: false });
  },
}));

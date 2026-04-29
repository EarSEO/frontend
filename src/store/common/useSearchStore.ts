import { create } from "zustand";

import { SearchSight } from "@/types/sight";
import { storySpots } from "@/types/storySpot";

interface SearchStore {
  searchedLocation?: (SearchSight | storySpots)[];
  setSearchLocation: (searchedLocation?: (SearchSight | storySpots)[]) => void;
}

const initialState = {
  searchedSpot: undefined,
};
export const useSearchStore = create<SearchStore>((set) => ({
  ...initialState,

  //검색 중 선택된 keyword
  setSearchLocation: (searchedLocation?: (SearchSight | storySpots)[]) => {
    if (!searchedLocation) {
      set({ searchedLocation: undefined });
    } else {
      set({ searchedLocation: searchedLocation });
    }
  },
}));

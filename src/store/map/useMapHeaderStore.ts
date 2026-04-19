import React from "react";

import {create} from "zustand";

interface MapHeaderStore {
  mapHeaderContent: React.ReactNode;
  setMapHeaderContent: (mapHeaderContent: React.ReactNode) => void;
}

export const useMapHeaderStore = create<MapHeaderStore>((set, get) => ({
  mapHeaderContent: undefined,
  setMapHeaderContent: (mapHeaderContent: React.ReactNode) => {
    set({mapHeaderContent});
  }
}));

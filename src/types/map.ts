import { Region } from "react-native-maps";

export interface MapBoundaries {
  northEast: {
    latitude: number;
    longitude: number;
  };
  southWest: {
    latitude: number;
    longitude: number;
  };
}

export interface MapRef {
  getBoundaries: () => Promise<MapBoundaries | null>;
  fitToPoints: (points: { latitude: number; longitude: number }[]) => void;
  moveToLocation: (location: Region) => void;
}
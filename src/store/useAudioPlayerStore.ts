import {AudioPlayer, createAudioPlayer, setAudioModeAsync} from "expo-audio";
import {create} from "zustand";

import {RouteItemType} from "@/types/route";

import getSightScriptApi from "@/api/sight/getSightDocentScriptApi";
import getStoryScriptApi from "@/api/story/getStoryDocentScriptApi";
import {useMiniPlayerStore} from "@/store/useMiniPlayerStore";
import {RouteItem, useRouteStore} from "@/store/useRouteStore";

const globalPlayer = createAudioPlayer(null, {
  updateInterval: 100,
});

setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
});

interface AudioPlayerStore {
  player: AudioPlayer;

  geoPlay: boolean;

  listeningUrl: string | undefined;
  listeningRouteItemType: RouteItemType | undefined;
  listeningRouteItem: RouteItem | undefined;
  currentScript: string | undefined;

  playTrack: (source: string) => void;
  pause: () => void;
  resume: () => void;
  pauseOrResume: () => void;
  replay: (time?: number) => void;
  forward: (time?: number) => void;

  setGeoPlay: (activate: boolean) => void;
  setListeningRouteItem: (routeItem: RouteItem | undefined) => void;
  removeItem: () => void;
  setScript: (audioScript: string) => string | boolean;

  calSecToString: (seconds: number) => string;
  setDocentScript: () => void;
  setListeningUrl: (url: string) => void;
}

export const useAudioPlayerStore = create<AudioPlayerStore>((set, get) => ({
  player: globalPlayer,

  geoPlay: true,
  audioItem: undefined,
  listeningUrl: undefined,
  listeningRouteItemType: undefined,
  listeningRouteItem: undefined,
  currentScript: undefined,

  setGeoPlay: (ativate: boolean): void => {
    set({geoPlay: ativate});
  },
  setListeningRouteItem: (routeItem: RouteItem | undefined): void => {
    if (!routeItem || !routeItem.itemDocentUrl) return;
    const {listeningRouteItem, listeningRouteItemType} = get();
    if (
      routeItem.itemType === listeningRouteItemType &&
      routeItem.itemId === listeningRouteItem?.itemId
    )
      return;
    set({
      listeningUrl: routeItem.itemImageUrl,
      listeningRouteItemType: routeItem.itemType,
      listeningRouteItem: routeItem,
      currentScript: undefined,
    });
    if (routeItem.itemType === "STORY_SPOT")
      useRouteStore.getState().enQueueStorySpot(routeItem.itemId);
    get().playTrack(routeItem.itemDocentUrl);
  },
  removeItem: (): void => {
    set({
      listeningUrl: undefined,
      listeningRouteItemType: undefined,
      listeningRouteItem: undefined,
      currentScript: undefined,
    });
    useMiniPlayerStore.getState().toggleLyrics(false);
    get().player.pause();
  },
  setScript: (audioScript: string): string | boolean => {
    set({
      currentScript: audioScript,
    });
    return audioScript;
  },

  playTrack: (source: string): void => {
    if (!source) return;
    const {player} = get();
    player.replace(source);
    player.play();
  },
  pause: (): void => {
    get().player.pause();
  },
  resume: (): void => {
    if (get().player.currentTime === get().player.duration)
      get().player.seekTo(0);
    get().player.play();
  },
  pauseOrResume: (): void => {
    if (get().player.playing) get().pause();
    else {
      get().resume();
    }
  },

  replay: (time?: number): void => {
    const player = get().player;
    player.seekTo(Math.max(0, player.currentTime - (time ?? 10)));
  },
  forward: (time?: number): void => {
    const player = get().player;
    player.seekTo(Math.min(player.duration, player.currentTime + (time ?? 10)));
  },

  calSecToString: (seconds: number): string => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
  },
  setDocentScript: async (): Promise<void> => {
    const {listeningRouteItem} = get();
    if (!listeningRouteItem?.itemType || !listeningRouteItem?.itemId) return;
    let script = "";
    if (listeningRouteItem?.itemType === "SIGHT")
      script = await getSightScriptApi(listeningRouteItem?.itemId).then(
        (docentScript) => docentScript.script,
      );
    else
      script = await getStoryScriptApi(listeningRouteItem?.itemId).then(
        (docentScript) => docentScript.script,
      );
    set({
      currentScript: script,
    });
  },
  setListeningUrl: (url: string): void => {
    set({
      listeningUrl: url
    });
  }
}));

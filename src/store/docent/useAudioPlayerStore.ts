import {
  AudioPlayer,
  AudioStatus,
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";
import { create } from "zustand";

import { SightDetailInfo } from "@/types/sight";

import getSightScriptApi from "@/api/sight/getSightDocentScriptApi";
import getStoryScriptApi from "@/api/story/getStoryDocentScriptApi";
import { useMiniPlayerStore } from "@/store/docent/useMiniPlayerStore";
import { RouteItem, useRouteStore } from "@/store/route/useRouteStore";

const globalPlayer = createAudioPlayer(null, {
  updateInterval: 100,
});

// 다른 오디오와 함께 재생
export const setAudioModeDuckOthers = async () => {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionModeAndroid: "duckOthers",
    interruptionMode: "duckOthers",
  });
};

// 다른 오디오를 멈추고 재생 (백그라운드에서 불가능)
export const setAudioModeDoNotMix = async () => {
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionModeAndroid: "doNotMix",
    interruptionMode: "doNotMix",
  });
};

interface AudioPlayerStore {
  player: AudioPlayer;
  audioMetadata: CustomAudioMetadata | undefined;

  geoPlay: boolean;

  playTrack: (source: string) => void;
  pause: () => void;
  resume: () => void;
  pauseOrResume: () => void;
  replay: (time?: number) => void;
  forward: (time?: number) => void;

  setGeoPlay: (activate: boolean) => void;
  setAudioMetadata: (routeItem: RouteItem | undefined) => void;
  removeItem: () => void;
  setScript: (audioScript: string) => string | boolean;

  calSecToString: (seconds: number) => string;
  setDocentScript: () => void;

  originAudioMetadata: CustomAudioMetadata | undefined;
  setTemporarySightInfo: (sightDetailInfo?: SightDetailInfo) => void;
  setActiveForLockScreen: () => void;
}

interface CustomAudioMetadata {
  id: string;
  url: string;
  title: string;
  artist?: string;
  artworkUrl?: string;
  routeItem?: RouteItem;
  script?: string;
}

export const routeItemToCustomAudioMetadata = (
  routeItem: RouteItem
): CustomAudioMetadata => {
  return {
    id:
      routeItem.itemType +
      "_" +
      (routeItem.itemType === "SIGHT" ? routeItem.itemId : routeItem.summaryId),
    url: routeItem.itemDocentUrl,
    title: routeItem.itemName,
    artist: routeItem.itemTheme,
    artworkUrl: routeItem.itemImageUrl,
    routeItem: routeItem,
    script: undefined,
  } as CustomAudioMetadata;
};

export const sightToCustomAudioMetadata = (
  sightDetailInfo: SightDetailInfo
): CustomAudioMetadata => {
  return {
    id: "SIGHT" + "_" + sightDetailInfo.id,
    url: sightDetailInfo.docentUrl,
    title: sightDetailInfo.title,
    artist: sightDetailInfo.theme,
    artworkUrl: sightDetailInfo.imgUrl,
    routeItem: undefined,
    script: undefined,
  } as CustomAudioMetadata;
};

// AudioPlayer 라이프 사이클 관리 및 재생중 컨텐츠 메타데이터 연관 스토어
export const useAudioPlayerStore = create<AudioPlayerStore>((set, get) => ({
  player: globalPlayer,
  audioMetadata: undefined,

  geoPlay: true,

  setGeoPlay: (ativate: boolean): void => {
    set({ geoPlay: ativate });
  },
  setAudioMetadata: (routeItem: RouteItem | undefined): void => {
    if (!routeItem || !routeItem.itemDocentUrl) return;
    const { audioMetadata } = get();
    if (
      routeItem.itemType === audioMetadata?.routeItem?.itemType &&
      routeItem.itemId === audioMetadata.routeItem.itemId
    )
      return;
    set({ audioMetadata: routeItemToCustomAudioMetadata(routeItem) });
    if (routeItem.itemType === "STORY_SPOT")
      useRouteStore.getState().enQueueStorySpot(routeItem.itemId);
    get().playTrack(routeItem.itemDocentUrl);
    get().setActiveForLockScreen();
    const audioFinisher = (status: AudioStatus) => {
      if (status.didJustFinish) {
        set({ audioMetadata: undefined });
        get().setActiveForLockScreen();
        get().player.removeListener("playbackStatusUpdate", audioFinisher);
        return;
      }
    };
    get().player.addListener("playbackStatusUpdate", audioFinisher);
  },
  removeItem: (): void => {
    set({ audioMetadata: undefined });
    useMiniPlayerStore.getState().toggleLyrics(false);
    get().player.pause();
  },
  setScript: (audioScript: string): string | boolean => {
    const { audioMetadata } = get();
    if (!audioMetadata) return false;
    set({
      audioMetadata: {
        ...audioMetadata,
        script: audioScript,
      },
    });
    return audioScript;
  },

  playTrack: (source: string): void => {
    if (!source) return;
    const { player } = get();
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
    const { audioMetadata } = get();
    if (!audioMetadata?.routeItem?.itemType || !audioMetadata.routeItem?.itemId)
      return;
    let script = "";
    if (audioMetadata.routeItem.itemType === "SIGHT")
      script = await getSightScriptApi(audioMetadata.routeItem.itemId).then(
        (docentScript) => docentScript.script
      );
    else
      script = await getStoryScriptApi(audioMetadata.routeItem.itemId).then(
        (docentScript) => docentScript.script
      );
    set({
      audioMetadata: {
        ...audioMetadata,
        script: script,
      },
    });
  },

  // 관광지 도슨트 임시 재생
  originAudioMetadata: undefined,
  setTemporarySightInfo: async (sightDetailInfo?: SightDetailInfo) => {
    const { playTrack, audioMetadata } = get();
    const { player } = get();
    if (!sightDetailInfo) {
      const { originAudioMetadata } = get();
      player.pause();
      if (!originAudioMetadata) {
        set({ audioMetadata: undefined });
      } else {
        set({
          audioMetadata: originAudioMetadata,
          originAudioMetadata: undefined,
        });
      }
      get().setActiveForLockScreen();
      return;
    }
    if (!audioMetadata) {
      set({ originAudioMetadata: audioMetadata });
    }
    set({ audioMetadata: sightToCustomAudioMetadata(sightDetailInfo) });
    playTrack(sightDetailInfo.docentUrl);
    get().setActiveForLockScreen();

    const temporaryAudioFinisher = async (status: AudioStatus) => {
      if (status.didJustFinish) {
        const { originAudioMetadata } = get();
        if (!originAudioMetadata) {
          set({ audioMetadata: undefined });
        } else {
          set({
            audioMetadata: originAudioMetadata,
            originAudioMetadata: undefined,
          });
        }
        get().setActiveForLockScreen();
        player.removeListener("playbackStatusUpdate", temporaryAudioFinisher);
        return;
      }
    };
    player.addListener("playbackStatusUpdate", temporaryAudioFinisher);
  },
  // 락스크린 정보 활성화
  setActiveForLockScreen: () => {
    const audioMetadata = get().audioMetadata;
    const { player } = get();
    if (!audioMetadata) {
      player.clearLockScreenControls();
      return;
    }
    player.setActiveForLockScreen(
      true,
      {
        albumTitle: audioMetadata.title,
        artist: audioMetadata.artist,
        artworkUrl: audioMetadata.artworkUrl,
        title: audioMetadata.title,
      },
      {
        showSeekBackward: true,
        showSeekForward: true,
      }
    );
  },
}));

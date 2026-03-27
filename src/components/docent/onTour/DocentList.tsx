import { useCallback } from "react";

import { ScrollView } from "react-native";

import { useRouter } from "expo-router";

import NowPlayingButton from "@/components/docent/common/NowPlayingButton";
import SightDocentCell from "@/components/docent/onTour/SightDocentCell";
import StorySpotDocentCell from "@/components/docent/onTour/StorySpotDocentCell";

import { RouteItemType } from "@/types/route";

import { useRouteStore } from "@/store/route/useRouteStore";

const DocentList: React.FC = () => {
  const { routeItems } = useRouteStore();
  const router = useRouter();
  const onPress = useCallback(
    (itemType: RouteItemType, id: number) => {
      if (itemType === "SIGHT") {
        router.push(`/?id=${id}`); //TODO 관광지 라우팅 협의 필요
      } else if (itemType === "STORY_SPOT") {
        router.push(`/story?id=${id}`); //TODO 이야기 라우팅 협의 필요
      }
    },
    [router]
  );
  return (
    <ScrollView>
      {routeItems?.map((routeItem, idx) => {
        if (routeItem.itemType === "SIGHT")
          return (
            <SightDocentCell
              onPress={() => onPress(routeItem.itemType, routeItem.itemId)}
              routeItem={routeItem}
              key={idx}
            >
              <NowPlayingButton routeItem={routeItem} buttonPosition={"LIST"} />
            </SightDocentCell>
          );
        else if (routeItem.itemType === "STORY_SPOT")
          return (
            <StorySpotDocentCell
              onPress={() => onPress(routeItem.itemType, routeItem.itemId)}
              routeItem={routeItem}
              position={"LIST"}
              key={idx}
              idx={idx}
            >
              <NowPlayingButton routeItem={routeItem} buttonPosition={"LIST"} />
            </StorySpotDocentCell>
          );
        else return <></>;
      })}
    </ScrollView>
  );
};

export default DocentList;

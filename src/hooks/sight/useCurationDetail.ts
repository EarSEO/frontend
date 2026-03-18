import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { CurationItem, CurationSightList } from "@/types/sight";

import { getCurationList, getCurationSightList } from "@/api/sight/getCuration";
import {useLocationStore} from "@/store/useLocationStore";
import { useRouteCartStore } from "@/store/useRouteCartStore";

import { useLocation } from "../useLocation";
import { useRequireLogin } from "../useRequireLogin";

export const useCurationDetail = () => {
  const location = useLocationStore(state => state.location);
  const { insertRouteCartItem } = useRouteCartStore();
  const router = useRouter();
  const requireLogin = useRequireLogin();

  const [curations, setCurations] = useState<CurationItem[]>([]);
  const [isCurationLoading, setIsCurationLoading] = useState(false);
  const routeCartItems = useRouteCartStore((state) => state.routeCartItems);

  const [curationSightList, setCurationSightList] =
    useState<CurationSightList[]>();
  const [selectedCurationTitle, setSelectedCurationTitle] = useState<
    string | undefined
  >("");
  const [selectedCurationDescription, setSelectedCurationDescription] =
    useState<string | undefined>("");

  // 큐레이션 메인에서 큐레이션 리스트 조회
  const fetchCurations = useCallback(async () => {
    try {
      setIsCurationLoading(true);
      const list = await getCurationList();
      setCurations(list);
    } catch (e) {
      console.error("큐레이션 조회 실패:", e);
    } finally {
      setIsCurationLoading(false);
    }
  }, []);

  //큐레이션 선택 시 sightList 조회
  const fetchCurationDetail = useCallback(
    async (id: number) => {
      try {
        const curationSightParam = {
          curationId: id,
          longitude: location.longitude,
          latitude: location.latitude,
        };
        const res = await getCurationSightList(curationSightParam);
        setCurationSightList(res?.curationSightList);
        setSelectedCurationTitle(res?.curationTitle);
        setSelectedCurationDescription(res?.description);
      } catch (error) {
        throw error;
      }
    },
    [curationSightList, location]
  );

  //카드에 있는지 확인
  const isInCart = useCallback(
    (sightId: string) => {
      return routeCartItems.some((item) => item.sightId === sightId);
    },
    [routeCartItems]
  );

  //이 여행으로 대치하고 여행 시작하기
  const handleAddSightListToMy = useCallback(() => {
    if (!requireLogin()) return;

    if (routeCartItems.length > 0) {
      alert("현재 카트에 저장된 경로가 있습니다.");
    } else {
      curationSightList?.forEach((sight) => {
        const AddSightInfo = {
          sightId: sight.sightId,
          title: sight.title,
          theme: sight.subTheme,
          address: sight.address,
          point: {
            longitude: sight.point.longitude,
            latitude: sight.point.latitude,
          },
          imageUrl: sight.imgUrl,
        };
        if (!isInCart(sight.sightId)) {
          insertRouteCartItem(AddSightInfo);
          router.replace("/(tabs)/myRoute");
          setCurationSightList(undefined);
        }
      });
    }
  }, [curationSightList, insertRouteCartItem, isInCart]);

  return {
    curations,
    isCurationLoading,
    fetchCurations,
    fetchCurationDetail,
    curationSightList,
    selectedCurationTitle,
    selectedCurationDescription,
    handleAddSightListToMy,
    isInCart,
    setCurationSightList,
  };
};

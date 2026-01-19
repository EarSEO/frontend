import { useCallback, useState } from "react";

import { CurationItem, CurationSightList } from "@/types/sight";

import { getCurationList, getCurationSightList } from "@/api/sight/getCuration";

import { useLocation } from "../useLocation";

export const useCurationDetail = () => {
  const { location } = useLocation();

  const [curations, setCurations] = useState<CurationItem[]>([]);
  const [isCurationLoading, setIsCurationLoading] = useState(false);

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

        console.log(curationSightList);
      } catch (error) {
        throw error;
      }
    },
    [curationSightList, location]
  );

  return {
    curations,
    isCurationLoading,
    fetchCurations,
    fetchCurationDetail,
    curationSightList,
    selectedCurationTitle,
    selectedCurationDescription,
  };
};

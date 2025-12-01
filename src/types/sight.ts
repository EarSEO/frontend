// 관광지 기본 정보 (목록 조회용)
export interface SightInfo {
  id: string;
  title: string;
  longitude: number;
  latitude: number;
  geoHash: string;
}

// 관광지 목록
export interface SightMapInfoList {
  sights: SightInfo[];
}

// 관광지 상세 정보
export interface SightDetailInfo {
  id: string;
  theme: string; // 관광지 테마 (문화시설, 자연관광지 등)
  outl: string; // 관광지 개요/설명
  title: string; // 관광지 이름
  fullAddress: string; // 전체 주소
  address: string; // 주소 요약 (구/동 단위)
  longitude: number; // 경도
  latitude: number; // 위도
  tel: string; // 전화번호
  imgUrl: string; // 이미지 URL
  useTime: string; // 이용 시간
  restDate: string; // 휴무일
  parking: string; // 주차 정보
  useFee: string; // 입장료
  distance: number; // 현재 위치로부터 거리 (km 단위, 소수점 1자리)
  docentUrl: string; // 도슨트 오디오 URL
}

export interface RectangleBoundsParams {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
}

export interface CircleBoundsParams {
  meters: number;
  longitude: number;
  latitude: number;
}

export interface SightDetailParams {
  id: string;
  longitude: number;
  latitude: number;
}

export interface SightDetailCardProps {
  selectedSight: SightInfo | null;
  sightDetail: SightDetailInfo | null;
  isDetailLoading: boolean;
  isInCart: boolean;
  onToggleRoute: () => void;
  onClose: () => void;
}

export interface SearchSightParams {
  keyword: string;
  longitude: string;
  latitude: string;
  minLongitude: string;
  minLatitude: string;
  maxLongitude: string;
  maxLatitude: string;
  limit: string;
}

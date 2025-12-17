import Button from "@/components/common/Button";

import { useMyRouteBottomSheetStore } from "@/store/useMyRouteBottomSheetStore";

const OnTourButton: React.FC = () => {
  const { setPreTour } = useMyRouteBottomSheetStore();
  return <Button text={"여행종료"} onPress={() => setPreTour(true)} />;
};

export default OnTourButton;

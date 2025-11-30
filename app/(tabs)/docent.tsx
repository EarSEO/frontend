import EmptyTour from "@/components/docent/emptyTour/EmptyTour";
import OnTour from "@/components/docent/onTour/OnTour";

import { useRouteStore } from "@/store/useRouteStore";

export default function Docent() {
  const { routeItems } = useRouteStore();

  if (routeItems === undefined) {
    return <EmptyTour />;
  }
  return <OnTour />;
}

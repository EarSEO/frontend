import {StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import EmptyTour from "@/components/docent/emptyTour/EmptyTour";
import OnTour from "@/components/docent/onTour/OnTour";

import { useRouteStore } from "@/store/useRouteStore";

export default function Docent() {
  const { routeItems } = useRouteStore();

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill]}>
      {
        routeItems === undefined ? <EmptyTour /> : <OnTour />
      }
    </SafeAreaView>
  )
}

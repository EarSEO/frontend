import { useCallback } from "react";

import { GestureResponderEvent, Modal } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import MiniPlayerModalLyrics from "@/components/docent/miniPlayerModal/MiniPlayerModalLyrics";
import MiniPlayerModalPlayer from "@/components/docent/miniPlayerModal/MiniPlayerModalPlayer";
import MiniPlayerModalQueueList from "@/components/docent/miniPlayerModal/MiniPlayerModalQueueList";
import MiniPlayerTitle from "@/components/docent/miniPlayerModal/MiniPlayerTitle";

import { theme } from "@/styles/theme";

import { useMiniPlayerStore } from "@/store/useMiniPlayerStore";

const MiniPlayerModal: React.FC = () => {
  const { enableLyrics, enableModal, closeModal } = useMiniPlayerStore();
  const onClose = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      closeModal();
    },
    [closeModal],
  );
  return (
    <Modal
      visible={enableModal}
      animationType="slide"
      presentationStyle="fullScreen"
      style={{ backgroundColor: theme.colors.background.background50 }}
    >
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            backgroundColor: theme.colors.background.background50,
            flex: 1,
            flexDirection: "column",
          }}
        >
          <MiniPlayerTitle onClose={onClose} />
          {enableLyrics ? (
            <MiniPlayerModalLyrics />
          ) : (
            <MiniPlayerModalQueueList />
          )}
          <MiniPlayerModalPlayer />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

export default MiniPlayerModal;

import { useCallback, useEffect, useState } from "react";

import { ActivityIndicator, Alert, FlatList, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import styled from "styled-components/native";

import { useCompletedRoute } from "@/hooks/route/useCompletedRoute";

import { CompletedRouteSummary } from "@/types/completedRoute";

import { theme } from "@/styles/theme";

export default function PastTrip() {
  const router = useRouter();
  const {
    routes,
    hasNext,
    isLoading,
    fetchRoutes,
    modifyRouteName,
    deleteRoute,
  } = useCompletedRoute();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRoute, setEditingRoute] =
    useState<CompletedRouteSummary | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchRoutes(true);
  }, []);

  const handleItemPress = (routeId: number) => {
    router.push({
      pathname: "/myPage/pastTripDetail",
      params: { routeId },
    });
  };

  const handleEditPress = (route: CompletedRouteSummary) => {
    setEditingRoute(route);
    setEditName(route.name);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    if (!editingRoute || !editName.trim()) return;

    try {
      await modifyRouteName(editingRoute.routeId, editName.trim());
      setEditModalVisible(false);
      setEditingRoute(null);
      setEditName("");
    } catch (error) {
      Alert.alert("오류", "이름 수정에 실패했습니다.");
    }
  };

  const handleDeletePress = (route: CompletedRouteSummary) => {
    Alert.alert(
      "여행 삭제",
      `"${route.name}"기록을 정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoute(route.routeId);
            } catch (error) {
              Alert.alert("오류", "삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: CompletedRouteSummary }) => (
      <RouteItem onPress={() => handleItemPress(item.routeId)}>
        <RouteInfo>
          <RouteName>{item.name}</RouteName>
          <RouteDate>{item.completedAt}</RouteDate>
        </RouteInfo>
        <ButtonGroup>
          <ActionButton onPress={() => handleEditPress(item)}>
            <Pencil size={18} color={theme.colors.text.textSecondary} />
          </ActionButton>
          <ActionButton onPress={() => handleDeletePress(item)}>
            <Trash2 size={18} color={theme.colors.text.textSecondary} />
          </ActionButton>
        </ButtonGroup>
      </RouteItem>
    ),
    []
  );

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <HeaderTitle>지난 여행</HeaderTitle>
        </Header>

        <FlatList
          data={routes}
          keyExtractor={(item) => item.routeId.toString()}
          renderItem={renderItem}
          refreshing={isLoading && routes.length === 0}
          onRefresh={() => fetchRoutes(true)}
          onEndReached={() => {
            if (hasNext && !isLoading) {
              fetchRoutes(false);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && routes.length > 0 ? (
              <ActivityIndicator style={{ padding: 20 }} />
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <EmptyContainer>
                <EmptyText>지난 여행이 없습니다</EmptyText>
              </EmptyContainer>
            ) : null
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />

        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalTitle>여행 이름 수정</ModalTitle>
              <ModalInput
                value={editName}
                onChangeText={setEditName}
                placeholder="여행 이름 입력"
                placeholderTextColor={theme.colors.text.textTertiary}
                autoFocus
              />
              <ModalButtonGroup>
                <ModalButton onPress={() => setEditModalVisible(false)}>
                  <ModalButtonText>취소</ModalButtonText>
                </ModalButton>
                <ModalButton onPress={handleEditSubmit} primary>
                  <ModalButtonText primary>확인</ModalButtonText>
                </ModalButton>
              </ModalButtonGroup>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </SafeAreaView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Header = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const HeaderTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.text.textPrimary};
`;

const RouteItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const RouteInfo = styled.View`
  flex: 1;
`;

const RouteName = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 4px;
`;

const RouteDate = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.text.textTertiary};
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px 12px;
`;

const ActionButtonText = styled.Text`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.text.textSecondary};
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${theme.colors.text.textTertiary};
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: ${theme.colors.background.modalBackground};
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  width: 100%;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.md}px;
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 16px;
  text-align: center;
`;

const ModalInput = styled.TextInput`
  background-color: ${theme.colors.background.background50};
  border-radius: ${theme.borderRadius.md}px;
  padding: 12px 16px;
  font-size: ${theme.typography.fontSize.md}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 16px;
`;

const ModalButtonGroup = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ModalButton = styled.TouchableOpacity<{ primary?: boolean }>`
  flex: 1;
  padding: 12px;
  border-radius: ${theme.borderRadius.md}px;
  background-color: ${(props) =>
    props.primary ? theme.colors.main.primary : theme.colors.grey.neutral200};
  align-items: center;
`;

const ModalButtonText = styled.Text<{ primary?: boolean }>`
  font-family: ${theme.typography.fontFamily.medium};
  font-size: ${theme.typography.fontSize.sm}px;
  color: ${(props) =>
    props.primary ? theme.colors.white : theme.colors.text.textPrimary};
`;

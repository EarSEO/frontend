import { useEffect, useState } from "react";

import { ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import styled from "styled-components/native";

import { NoticeDetail as NoticeDetailType } from "@/types/notice";

import { theme } from "@/styles/theme";

import { getNoticeDetail } from "@/api/notice/getNoticeApi";

export default function NoticeDetail() {
  const router = useRouter();
  const { noticeId } = useLocalSearchParams<{ noticeId: string }>();
  const [notice, setNotice] = useState<NoticeDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!noticeId) return;
    const fetch = async () => {
      try {
        const data = await getNoticeDetail(Number(noticeId));
        setNotice(data);
      } catch (error) {
        console.error("공지사항 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [noticeId]);

  if (isLoading) {
    return (
      <Container>
        <SafeAreaView style={{ flex: 1 }}>
          <Header>
            <BackButton onPress={() => router.back()}>
              <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
            </BackButton>
          </Header>
          <LoadingContainer>
            <ActivityIndicator />
          </LoadingContainer>
        </SafeAreaView>
      </Container>
    );
  }

  if (!notice) {
    return (
      <Container>
        <SafeAreaView style={{ flex: 1 }}>
          <Header>
            <BackButton onPress={() => router.back()}>
              <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
            </BackButton>
          </Header>
          <EmptyContainer>
            <EmptyText>공지사항을 찾을 수 없습니다</EmptyText>
          </EmptyContainer>
        </SafeAreaView>
      </Container>
    );
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <Header>
          <BackButton onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
          </BackButton>
        </Header>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <DateText>{notice.createdAt.replace(/\//g, ".")}</DateText>
          <TitleText>{notice.noticeTitle}</TitleText>
          <Divider />
          <ContentText>{notice.noticeContent}</ContentText>
        </ScrollView>
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
  flex-direction: row;
  align-items: center;
  padding-horizontal: 16px;
`;

const BackButton = styled.TouchableOpacity`
  width: 32px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const DateText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xxs}px;
  color: ${theme.colors.text.textTertiary};
  margin-bottom: 8px;
`;

const TitleText = styled.Text`
  font-family: ${theme.typography.fontFamily.bold};
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.text.textPrimary};
  margin-bottom: 16px;
  line-height: ${theme.typography.fontSize.lg * 1.4}px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${theme.colors.grey.neutral200};
  margin-bottom: 16px;
`;

const ContentText = styled.Text`
  font-family: ${theme.typography.fontFamily.regular};
  font-size: ${theme.typography.fontSize.xs}px;
  color: ${theme.colors.text.textPrimary};
  line-height: ${theme.typography.fontSize.xs * 1.6}px;
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

import { useCallback, useEffect, useState } from "react";

import { ActivityIndicator, FlatList } from "react-native";

import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import styled from "styled-components/native";

import { NoticePageItem } from "@/types/notice";

import { theme } from "@/styles/theme";

import { getNoticeList } from "@/api/notice/getNoticeApi";

export default function Notice() {
    const router = useRouter();
    const [notices, setNotices] = useState<NoticePageItem[]>([]);
    const [page, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotices = async (reset: boolean = false) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const currentPage = reset ? 0 : page;
            const data = await getNoticeList(currentPage);
            setNotices(reset ? data.content : [...notices, ...data.content]);
            setHasNext(data.hasNext);
            setPage(currentPage + 1);
        } catch (error) {
            console.error("공지사항 목록 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices(true);
    }, []);

    const handleItemPress = (noticeId: number) => {
        router.push({
            pathname: "/myPage/noticeDetail",
            params: { noticeId },
        });
    };

    const renderItem = useCallback(
        ({ item }: { item: NoticePageItem }) => (
            <NoticeItem onPress={() => handleItemPress(item.noticeId)}>
                <NoticeInfo>
                    <NoticeTitle>{item.title}</NoticeTitle>
                    <NoticeDate>{item.createdAt.replace(/\//g, ".")}</NoticeDate>
                </NoticeInfo>
                <ChevronRight size={20} color={theme.colors.grey.neutral400} />
            </NoticeItem>
        ),
        []
    );

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <ChevronLeft size={24} color={theme.colors.text.textPrimary} />
                </BackButton>
                <HeaderTitle>공지사항</HeaderTitle>
                <Spacer />
            </Header>

            <FlatList
                data={notices}
                keyExtractor={(item) => item.noticeId.toString()}
                renderItem={renderItem}
                onEndReached={() => {
                    if (hasNext && !isLoading) fetchNotices(false);
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading && notices.length > 0 ? (
                        <ActivityIndicator style={{ padding: 20 }} />
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <EmptyContainer>
                            <EmptyText>공지사항이 없습니다</EmptyText>
                        </EmptyContainer>
                    ) : null
                }
                contentContainerStyle={{ flexGrow: 1 }}
            />
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
  justify-content: space-between;
  padding-horizontal: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const BackButton = styled.TouchableOpacity`
  width: 32px;
`;

const HeaderTitle = styled.Text`
  font-family: ${theme.typography.fontFamily.semiBold};
  font-size: ${theme.typography.fontSize.lg}px;
  color: ${theme.colors.text.textPrimary};
`;

const Spacer = styled.View`
  width: 32px;
`;

const NoticeItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.grey.neutral200};
`;

const NoticeInfo = styled.View`
    flex: 1;
`;

const NoticeTitle = styled.Text`
    font-family: ${theme.typography.fontFamily.medium};
    font-size: ${theme.typography.fontSize.sm}px;
    color: ${theme.colors.text.textPrimary};
`;

const NoticeDate = styled.Text`
    font-family: ${theme.typography.fontFamily.regular};
    font-size: ${theme.typography.fontSize.xxs}px;
    color: ${theme.colors.text.textTertiary};
    margin-top: 4px;
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
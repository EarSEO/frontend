export interface NoticePageItem {
    noticeId: number;
    title: string;
    createdAt: string;
    updatedAt: string;
}
export interface NoticeDetail {
    noticeId: number;
    noticeTitle: string;
    noticeContent: string;
    createdAt: string;
    updatedAt: string;
}

export interface NoticePageResponse {
    content: NoticePageItem[];
    number: number;
    size: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}
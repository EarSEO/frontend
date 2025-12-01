// HTML <br> 태그를 줄바꿈으로 치환 + 양끝 공백 제거
export const normalizeHtmlBreaks = (value?: string | null): string => {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, "\n") // <br>, <br/>, <br /> 모두 처리
    .replace(/&nbsp;/gi, " ") // 필요하면 공백도 처리
    .trim();
};

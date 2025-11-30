export const API_ENDPOINTS = {
  AUTH: {
    REFRESH: "/api/member/reissue",
    LOGIN: "/api/member/login",
    SIGNUP: "/api/member/signup",
    LOGOUT: "/api/user/member/logout",
    SOCIAL_LOGIN: "/api/member/oauth/google",
    SOCIAL_SIGNUP: "/api/member/oauth/additional-info",
    EMAIL_SEND: "/api/member/email/send",
    EMAIL_VERIFY: "/api/member/email/verify",
    NICKNAME_CHECK: "/api/member/nickname/check",
  },

  STORY: {
    SPOTTOTALINFO: (storySpotId: number) =>
      `/api/story/spot/${storySpotId}/info`,
  },
};

export default API_ENDPOINTS;

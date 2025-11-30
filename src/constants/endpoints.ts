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
  SIGHT: {
    DOCENT_SCRIPT: "/api/sight/docent",
  },
  STORY: {
    DOCENT_SCRIPT: "/api/story/docent",
  },
  ROUTE: {
    CREATE_IN_PROGRESS_ROUTE: "/api/user/route/in-progress",
    COMPLETE_ROUTE: (routeId: number) => `/api/user/route/${routeId}'complete`,
  },
};

export default API_ENDPOINTS;

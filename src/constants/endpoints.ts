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
    RECTANGLE: "/api/sight/map/rectangle",
    CIRCLE: "/api/sight/map/circle",
    DETAIL: "/api/sight/detail",
    SEARCH: "/api/sight/search",
  },
  STORY: {
    DOCENT_SCRIPT: "/api/story/docent",
  },
  ROUTE: {
    CREATE_IN_PROGRESS_ROUTE: "/api/user/route/in-progress",
    COMPLETE_ROUTE: (routeId: number) => `/api/user/route/${routeId}/complete`,
  },
  MEMBER: {
    EDIT_PROFILE_IMAGE: "/api/user/member/profile-image",
    EDIT_PROFILE: "/api/user/member/profile",
    CHANGE_PASSWORD: "/api/user/member/password",
  },
};

export default API_ENDPOINTS;

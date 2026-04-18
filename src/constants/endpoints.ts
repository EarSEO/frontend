export const API_ENDPOINTS = {
  AUTH: {
    REFRESH: "/api/member/reissue",
    LOGIN: "/api/member/login",
    SIGNUP: "/api/member/signup",
    LOGOUT: "/api/user/member/logout",
    SOCIAL_LOGIN_GOOGLE: "/api/member/oauth/google",
    SOCIAL_LOGIN_APPLE: "/api/member/oauth/apple",
    SOCIAL_SIGNUP: "/api/member/oauth/additional-info",
    EMAIL_SIGNUP_SEND: "/api/member/email/signup/send",
    EMAIL_VERIFY: "/api/member/email/verify",
    EMAIL_PASSWORD_SEND: "/api/member/email/password/send",
    NICKNAME_CHECK: "/api/member/nickname/check",
    RESET_PASSWORD: "/api/member/reset-password",
  },

  STORY: {
    SPOT_INFO: (storySpotId: number) => `/api/story/spot/${storySpotId}/info`,
    SPOT_INFO_BRIEF: "/api/story/spot/info/brief",
    CREATE: "/api/user/story/create",
    DOCENT_SCRIPT: "/api/story/docent",
    SEARCH: "/api/story/search/title",
    STORY_LIST_IN_MAP: "/api/story/map/rectangle",
    SPOT_LIST_IN_MAP: "/api/story/spot/map/rectangle",
    EDIT: (storyId: number) => `/api/user/story/${storyId}`,
    MY_STORIES: "/api/user/story/my",
    TOGGLE_LIKE: (storyId: number) => `/api/user/story/${storyId}/like`,
    LIKED_STORIES: "/api/user/story/liked",
  },

  SIGHT: {
    DOCENT_SCRIPT: "/api/sight/docent",
    RECTANGLE: "/api/sight/map/rectangle",
    CIRCLE: "/api/sight/map/circle",
    DETAIL: "/api/sight/detail",
    SEARCH: "/api/sight/search",
    CURATION: {
      CURATION: "/api/sight/curation",
      SIGHT_LIST: (curationId: number) => `/api/sight/curation/${curationId}`,
    },
    BOOKMARK: {
      ADD: (sightId: number) => `/api/user/sight/${sightId}/bookmark`,
      DELETE: (sightId: number) => `/api/user/sight/${sightId}/bookmark`,
      GET_BOOKMARK: "/api/user/sight/bookmark",
    },
  },

  ROUTE: {
    CREATE_IN_PROGRESS_ROUTE: "/api/user/route/in-progress",
    COMPLETE_ROUTE: (routeId: number) => `/api/user/route/${routeId}/complete`,
  },
  MEMBER: {
    GET_PROFILE: "/api/user/member/profile",
    EDIT_PROFILE_IMAGE: "/api/user/member/profile-image",
    EDIT_PROFILE: "/api/user/member/profile",
    CHANGE_PASSWORD: "/api/user/member/password",
  },
};

export default API_ENDPOINTS;

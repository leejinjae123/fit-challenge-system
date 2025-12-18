// API 엔드포인트 관리
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/users/profile',
    ONBOARDING: '/users/onboarding', // 온보딩 정보 저장
    ONBOARDING_STATUS: '/users/me/onboarding-status', // 온보딩 완료 여부 확인
    STATS: '/users/stats',
  },
  CHALLENGE: {
    LIST: '/challenges',
    DETAIL: (id) => `/challenges/${id}`,
    JOIN: (id) => `/challenges/${id}/join`,
  },
  WORKOUT: {
    RECORDS: '/workout-records',
    MY_RECORDS: '/workout-records/my',
    RECOMMENDATION: '/exercises/recommendation', // 추천 루틴
  },
  AI: {
    ANALYZE: '/ai/analyze',
  }
};

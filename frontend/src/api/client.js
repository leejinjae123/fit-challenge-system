import axios from 'axios';

// API 기본 URL 설정
// 개발 환경(npm start): package.json의 proxy 설정에 의해 http://localhost:8080/api/v1으로 연결됨
// 배포 환경(Docker/Nginx): Nginx의 reverse proxy 설정에 의해 /api/v1으로 연결됨 (상대 경로 사용)
const baseURL = process.env.REACT_APP_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
});

// [Request Interceptor] 요청 전처리
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져와 헤더에 주입
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [Response Interceptor] 응답 전처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답의 경우 data 부분만 바로 반환 (response.data.data 구조라면 response.data.data 반환 등)
    // 여기서는 axios response.data 전체를 반환
    return response.data;
  },
  (error) => {
    // 공통 에러 처리 로직
    const errorResponse = error.response;
    let message = '네트워크 오류가 발생했습니다.';

    if (errorResponse) {
      // 서버에서 내려준 에러 메시지가 있다면 사용
      message = errorResponse.data?.message || `Error: ${errorResponse.status}`;
      
      // 401 Unauthorized 처리 (예: 로그인 만료)
      if (errorResponse.status === 401) {
        // TODO: 로그아웃 처리 또는 리프레시 토큰 로직
        console.warn('Session expired. Please login again.');
      }
    }

    console.error('[API Error]', message, error);
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;

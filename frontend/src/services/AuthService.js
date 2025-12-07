import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class AuthService {
  
  async login(email, password) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      // 로그인 성공 시 토큰(있다면)과 유저 정보 저장
      // 현재는 토큰 대신 유저 ID나 이메일을 저장한다고 가정 (데모용)
      if (response.id) {
        localStorage.setItem('userId', response.id);
        localStorage.setItem('isOnboarded', 'true');
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getMyInfo() {
    try {
      // X-User-Id 헤더는 Client.js 인터셉터에서 넣거나 해야 함
      // 여기서는 일단 호출만 함
      const response = await apiClient.get(ENDPOINTS.USER.PROFILE.replace('/profile', '/me'));
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;


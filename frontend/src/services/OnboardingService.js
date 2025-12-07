import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class OnboardingService {
  /**
   * 사용자 초기 정보를 서버에 전송합니다.
   * @param {Object} userInfo - 사용자 입력 정보 { weight, height, oneRM, goalCount }
   * @returns {Promise<Object>} - 서버 응답
   */
  async submitUserInfo(userInfo) {
    try {
      // Presentation Layer(UI)의 데이터를 API 스펙에 맞게 변환 (Adapter 역할)
      const payload = {
        email: userInfo.email,
        password: userInfo.password,
        nickname: userInfo.nickname,
        weight: parseFloat(userInfo.weight),
        height: parseFloat(userInfo.height),
        // oneRM 값이 비어있으면 0으로 처리
        squatOneRm: userInfo.oneRM ? parseInt(userInfo.oneRM, 10) : 0, // DTO 필드명에 맞춤
        weeklyGoal: userInfo.goalCount // DTO 필드명에 맞춤
      };
      
      // API 호출
      const response = await apiClient.post(ENDPOINTS.USER.ONBOARDING, payload);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 서버에서 사용자의 온보딩 완료 여부를 확인합니다.
   * @returns {Promise<boolean>} - 완료되었으면 true
   */
  async checkOnboardingStatus() {
    try {
      const response = await apiClient.get(ENDPOINTS.USER.ONBOARDING_STATUS);
      return response; // true or false
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      return false; // 에러 시 미완료로 간주 (안전하게)
    }
  }
}

const onboardingServiceInstance = new OnboardingService();
export default onboardingServiceInstance;

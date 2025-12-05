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
        weight: parseFloat(userInfo.weight),
        height: parseFloat(userInfo.height),
        // oneRM 값이 비어있으면 0으로 처리
        one_rm: userInfo.oneRM ? parseInt(userInfo.oneRM, 10) : 0,
        weekly_goal: userInfo.goalCount
      };
      
      // API 호출
      const response = await apiClient.post(ENDPOINTS.USER.ONBOARDING, payload);
      return response;
    } catch (error) {
      // 에러를 다시 던져서 UI 컴포넌트가 알림 등을 처리할 수 있게 함
      throw error;
    }
  }
}

// 싱글톤 인스턴스로 내보냄
export default new OnboardingService();


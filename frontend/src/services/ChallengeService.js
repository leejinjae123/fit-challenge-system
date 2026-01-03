import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

class ChallengeService {
  
  // 내 운동 기록 조회
  async getMyWorkoutRecords(userId) {
    try {
      const config = {};
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      const response = await apiClient.get(ENDPOINTS.WORKOUT.MY_RECORDS, config);
      return response;
    } catch (error) {
      console.error('Failed to fetch workout records:', error);
      throw error;
    }
  }

  // 운동 기록 생성 (루틴 완료 등)
  async createWorkoutRecord(data, userId) {
    try {
      const config = {};
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      const response = await apiClient.post(ENDPOINTS.WORKOUT.RECORDS, data, config);
      return response;
    } catch (error) {
      console.error('Failed to create workout record:', error);
      throw error;
    }
  }

  // 운동 계획 완료 처리
  async completeWorkoutRecord(recordId, userId) {
    try {
      const config = {};
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      const response = await apiClient.put(`${ENDPOINTS.WORKOUT.RECORDS}/${recordId}/complete`, {}, config);
      return response;
    } catch (error) {
      console.error('Failed to complete workout record:', error);
      throw error;
    }
  }

  // 운동 기록/계획 삭제
  async deleteWorkoutRecord(recordId, userId) {
    try {
      const config = {};
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      await apiClient.delete(`${ENDPOINTS.WORKOUT.RECORDS}/${recordId}`, config);
    } catch (error) {
      console.error('Failed to delete workout record:', error);
      throw error;
    }
  }

  // 추천 루틴 조회
  async getRecommendations(levelCode, userId) {
    try {
      const config = {
        params: { levelCode }
      };
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      const response = await apiClient.get(ENDPOINTS.WORKOUT.RECOMMENDATION, config);
      return response;
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }

  // 전체 운동 목록 조회 (페이징, 검색 및 필터링 지원)
  async getAllExercises(page = 0, size = 20, search = '', levelCode = '', categoryCode = '', targetCode = '') {
    try {
      const response = await apiClient.get('/exercises', {
        params: { page, size, search, levelCode, categoryCode, targetCode }
      });
      return response; 
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      throw error;
    }
  }

  // 일일 운동 기록 저장 (몸무게 등)
  async saveUserWorkout(data, userId) {
    try {
      const config = {};
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      const response = await apiClient.post(ENDPOINTS.WORKOUT.USER_WORKOUTS, data, config);
      return response;
    } catch (error) {
      console.error('Failed to save user workout:', error);
      throw error;
    }
  }

  // 유저 일일 기록 리스트 조회
  async getUserWorkouts(userId) {
    try {
      const config = {};
      if (userId) {
        config.headers = { 'X-User-Id': userId };
      }
      const response = await apiClient.get(ENDPOINTS.WORKOUT.USER_WORKOUTS, config);
      return response;
    } catch (error) {
      console.error('Failed to fetch user workouts:', error);
      throw error;
    }
  }
}

const challengeServiceInstance = new ChallengeService();
export default challengeServiceInstance;


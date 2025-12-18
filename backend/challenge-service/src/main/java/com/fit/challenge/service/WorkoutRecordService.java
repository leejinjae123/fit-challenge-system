package com.fit.challenge.service;

import com.fit.challenge.domain.RecordStatus;
import com.fit.challenge.domain.WorkoutRecord;
import com.fit.challenge.dto.WorkoutRecordDto;
import java.util.List;

/**
 * 운동 기록 서비스 인터페이스
 * <p>
 * 운동 기록의 생성(저장) 및 조회 기능을 정의합니다.
 */
public interface WorkoutRecordService {

    /**
     * 운동 기록 생성 (계획 또는 완료)
     *
     * @param dto 운동 기록 정보 DTO
     * @return 저장된 운동 기록 DTO
     */
    WorkoutRecordDto createWorkoutRecord(WorkoutRecordDto dto);

    /**
     * 내 운동 기록 조회
     * <p>
     * 특정 사용자의 모든 운동 기록을 최신순으로 조회합니다.
     *
     * @param userId 조회할 사용자 ID
     * @return 운동 기록 DTO 리스트
     */
    List<WorkoutRecordDto> getWorkoutRecordsByUserId(Long userId);

    /**
     * 운동 기록 완료 처리
     * @param recordId 완료할 운동 기록 ID
     * @param userId 요청한 사용자 ID (본인 확인용)
     * @return 업데이트된 운동 기록 DTO
     */
    WorkoutRecordDto completeWorkoutRecord(Long recordId, Long userId);

    /**
     * 운동 기록 삭제
     * @param recordId 삭제할 운동 기록 ID
     * @param userId 요청한 사용자 ID (본인 확인용)
     */
    void deleteWorkoutRecord(Long recordId, Long userId);
}

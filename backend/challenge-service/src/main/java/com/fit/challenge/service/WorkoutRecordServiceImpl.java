package com.fit.challenge.service;

import com.fit.challenge.domain.RecordStatus;
import com.fit.challenge.domain.WorkoutRecord;
import com.fit.challenge.dto.WorkoutRecordDto;
import com.fit.challenge.repository.WorkoutRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 운동 기록 서비스 구현체
 * <p>
 * {@link WorkoutRecordService}를 구현하며, 운동 기록에 대한 CRUD를 담당합니다.
 */
@Service
@RequiredArgsConstructor
public class WorkoutRecordServiceImpl implements WorkoutRecordService {

    private final WorkoutRecordRepository workoutRecordRepository;

    /**
     * 운동 기록 저장 구현
     * <p>
     * DTO를 Entity로 변환하여 저장하고, 다시 DTO로 변환하여 반환합니다.
     */
    @Override
    @Transactional
    public WorkoutRecordDto createWorkoutRecord(WorkoutRecordDto dto) {
        // DTO -> Entity 변환
        WorkoutRecord record = dto.toEntity();
        
        // DB 저장
        WorkoutRecord saved = workoutRecordRepository.save(record);
        
        // Entity -> DTO 변환 후 반환
        return WorkoutRecordDto.from(saved);
    }

    /**
     * 내 운동 기록 조회 구현
     * <p>
     * 읽기 전용 트랜잭션을 사용하여 성능을 최적화합니다.
     * 스트림 API를 사용하여 Entity 리스트를 DTO 리스트로 변환합니다.
     */
    @Override
    @Transactional(readOnly = true)
    public List<WorkoutRecordDto> getWorkoutRecordsByUserId(Long userId) {
        return workoutRecordRepository.findByUserIdOrderByPerformedAtDesc(userId).stream()
                .map(WorkoutRecordDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkoutRecordDto completeWorkoutRecord(Long recordId, Long userId) {
        WorkoutRecord record = workoutRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("기록을 찾을 수 없습니다."));
        
        // 본인 확인
        if (!record.getUserId().equals(userId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        record.setStatus(RecordStatus.COMPLETED);
        return WorkoutRecordDto.from(record);
    }

    @Override
    @Transactional
    public void deleteWorkoutRecord(Long recordId, Long userId) {
        WorkoutRecord record = workoutRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("기록을 찾을 수 없습니다."));
        
        // 본인 확인 (심플한 체크)
        if (!record.getUserId().equals(userId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        workoutRecordRepository.delete(record);
    }
}

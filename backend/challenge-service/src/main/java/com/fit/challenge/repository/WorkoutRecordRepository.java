package com.fit.challenge.repository;

import com.fit.challenge.domain.RecordStatus;
import com.fit.challenge.domain.WorkoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface WorkoutRecordRepository extends JpaRepository<WorkoutRecord, Long> {
    List<WorkoutRecord> findByUserIdOrderByPerformedAtDesc(Long userId);
    List<WorkoutRecord> findByUserIdAndPlanDate(Long userId, LocalDate planDate);
    List<WorkoutRecord> findByUserIdAndStatusAndPerformedAtAfter(Long userId, RecordStatus status, LocalDateTime performedAt);
}


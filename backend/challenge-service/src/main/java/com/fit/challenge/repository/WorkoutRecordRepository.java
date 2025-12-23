package com.fit.challenge.repository;

import com.fit.challenge.domain.WorkoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;

public interface WorkoutRecordRepository extends JpaRepository<WorkoutRecord, Long> {
    List<WorkoutRecord> findByUserIdOrderByPerformedAtDesc(Long userId);
    List<WorkoutRecord> findByUserIdAndPlanDate(Long userId, LocalDate planDate);
}


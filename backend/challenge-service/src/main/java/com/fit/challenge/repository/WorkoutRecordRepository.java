package com.fit.challenge.repository;

import com.fit.challenge.domain.WorkoutRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutRecordRepository extends JpaRepository<WorkoutRecord, Long> {
    List<WorkoutRecord> findByUserIdOrderByPerformedAtDesc(Long userId);
}


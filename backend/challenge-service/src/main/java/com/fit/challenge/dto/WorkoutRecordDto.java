package com.fit.challenge.dto;

import com.fit.challenge.domain.RecordStatus;
import com.fit.challenge.domain.WorkoutRecord;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
public class WorkoutRecordDto {
    private Long id;
    private Long userId;
    private LocalDateTime performedAt;
    private LocalDate planDate;
    private String exerciseType;
    private Integer count;
    private Integer sets;
    private Integer reps;
    private RecordStatus status;
    private Double accuracy;

    public static WorkoutRecordDto from(WorkoutRecord record) {
        WorkoutRecordDto dto = new WorkoutRecordDto();
        dto.setId(record.getId());
        dto.setUserId(record.getUserId());
        dto.setPerformedAt(record.getPerformedAt());
        dto.setPlanDate(record.getPlanDate());
        dto.setExerciseType(record.getExerciseType());
        dto.setCount(record.getCount());
        dto.setSets(record.getSets());
        dto.setReps(record.getReps());
        dto.setStatus(record.getStatus());
        dto.setAccuracy(record.getAccuracy());
        return dto;
    }

    public WorkoutRecord toEntity() {
        WorkoutRecord record = new WorkoutRecord();
        record.setId(this.id);
        record.setUserId(this.userId);
        record.setPerformedAt(this.performedAt != null ? this.performedAt : LocalDateTime.now());
        record.setPlanDate(this.planDate != null ? this.planDate : LocalDate.now());
        record.setExerciseType(this.exerciseType);
        record.setCount(this.count != null ? this.count : 0);
        record.setSets(this.sets);
        record.setReps(this.reps);
        record.setStatus(this.status != null ? this.status : RecordStatus.COMPLETED);
        record.setAccuracy(this.accuracy);
        return record;
    }
}

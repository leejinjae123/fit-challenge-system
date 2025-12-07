package com.fit.challenge.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_records")
public class WorkoutRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // MSA 환경이므로 User 객체를 직접 참조하지 않고 ID만 저장
    @Column(nullable = false)
    private Long userId; 

    @Column(nullable = false)
    private LocalDateTime performedAt; // 운동 일시

    @Column(nullable = false)
    private String exerciseType; // SQUAT, PUSHUP 등

    @Column(nullable = false)
    private Integer count; // 횟수

    private Double accuracy; // 자세 정확도 (0.0 ~ 1.0)

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
}


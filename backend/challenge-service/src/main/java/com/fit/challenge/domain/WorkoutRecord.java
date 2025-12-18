package com.fit.challenge.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_records")
@Getter @Setter
@NoArgsConstructor
public class WorkoutRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // MSA 환경이므로 User 객체를 직접 참조하지 않고 ID만 저장
    @Column(nullable = false)
    private Long userId; 

    @Column(nullable = false)
    private LocalDateTime performedAt; // 운동 일시

    @Column(name = "plan_date")
    private LocalDate planDate; // 계획 날짜

    @Column(nullable = false)
    private String exerciseType; // SQUAT, PUSHUP 등

    @Column(nullable = false)
    private Integer count; // 총 횟수 (sets * reps) 또는 단순 횟수

    @Column(name = "set_count")
    private Integer sets; // 세트 수

    @Column(name = "reps_per_set")
    private Integer reps; // 세트 당 횟수

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordStatus status = RecordStatus.COMPLETED;

    private Double accuracy; // 자세 정확도 (0.0 ~ 1.0)
}

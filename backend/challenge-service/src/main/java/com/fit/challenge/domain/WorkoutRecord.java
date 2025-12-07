package com.fit.challenge.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

    @Column(nullable = false)
    private String exerciseType; // SQUAT, PUSHUP 등

    @Column(nullable = false)
    private Integer count; // 횟수

    private Double accuracy; // 자세 정확도 (0.0 ~ 1.0)
}

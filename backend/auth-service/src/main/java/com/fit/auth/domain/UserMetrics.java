package com.fit.auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_metrics")
@Getter @Setter
@NoArgsConstructor
public class UserMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double height;      // 키 (cm)
    private Double weight;      // 몸무게 (kg)
    private Integer squatOneRm; // 스쿼트 1RM (kg)
    private Integer weeklyGoal; // 주간 목표 횟수

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

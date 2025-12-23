package com.fit.challenge.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "user_workout")
@Getter @Setter
@NoArgsConstructor
public class UserWorkout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Double weight;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Column(nullable = false)
    private Double successRate; // 성공률 (0.0 ~ 100.0)

    @Column(nullable = false)
    private LocalDate createdAt; // 등록 날짜
}


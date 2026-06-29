package com.fit.challenge.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@NoArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 40)
    private String targetType;

    @Column(nullable = false)
    private Integer targetValue;

    @Column(nullable = false)
    private Integer rewardPoints;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer participantCount = 0;

    @Column(nullable = false)
    private Boolean active = true;
}

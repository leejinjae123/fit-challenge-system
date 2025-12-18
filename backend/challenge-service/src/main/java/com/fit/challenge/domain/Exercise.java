package com.fit.challenge.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exercises")
@Getter @Setter
@NoArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_code")
    private CommonCode level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_code")
    private CommonCode category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_code")
    private CommonCode target;

    @Column(name = "exercise_name", length = 100, nullable = false)
    private String exerciseName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "recommendation_score")
    private Integer recommendationScore = 3;
}






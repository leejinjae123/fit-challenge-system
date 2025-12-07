package com.fit.auth.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "user_metrics")
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

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Integer getSquatOneRm() { return squatOneRm; }
    public void setSquatOneRm(Integer squatOneRm) { this.squatOneRm = squatOneRm; }
    public Integer getWeeklyGoal() { return weeklyGoal; }
    public void setWeeklyGoal(Integer weeklyGoal) { this.weeklyGoal = weeklyGoal; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}


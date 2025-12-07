package com.fit.auth.domain;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    private Boolean isOnboarded = false;

    // 포인트 필드 추가 (동시성 테스트용)
    private Long points = 0L;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserMetrics userMetrics;

    public void setUserMetrics(UserMetrics userMetrics) {
        this.userMetrics = userMetrics;
        userMetrics.setUser(this);
    }
}

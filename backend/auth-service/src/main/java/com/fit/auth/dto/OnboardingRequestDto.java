package com.fit.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class OnboardingRequestDto {
    // 계정 정보
    private String email;
    private String password;
    private String nickname;

    // 신체 정보
    private Double height;
    private Double weight;
    private String levelCode;
    private Integer weeklyGoal;
}

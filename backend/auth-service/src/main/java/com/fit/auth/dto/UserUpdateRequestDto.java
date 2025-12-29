package com.fit.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class UserUpdateRequestDto {
    private String nickname;
    private Double height;
    private Double weight;
    private String levelCode;
    private Integer weeklyGoal;
}



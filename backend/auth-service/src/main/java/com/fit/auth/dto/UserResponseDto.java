package com.fit.auth.dto;

import com.fit.auth.domain.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class UserResponseDto {
    private Long id;
    private String email;
    private String nickname;
    private Boolean isOnboarded;
    
    // 신체 정보
    private Double height;
    private Double weight;
    private Integer squatOneRm;
    private Integer weeklyGoal;

    public static UserResponseDto from(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setNickname(user.getNickname());
        dto.setIsOnboarded(user.getIsOnboarded());
        
        if (user.getUserMetrics() != null) {
            dto.setHeight(user.getUserMetrics().getHeight());
            dto.setWeight(user.getUserMetrics().getWeight());
            dto.setSquatOneRm(user.getUserMetrics().getSquatOneRm());
            dto.setWeeklyGoal(user.getUserMetrics().getWeeklyGoal());
        }
        return dto;
    }
}


package com.fit.challenge.dto;

import com.fit.challenge.domain.UserWorkout;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor
public class UserWorkoutDto {
    private Long id;
    private Long userId;
    private Double weight;
    private String memo;
    private Double successRate;
    private LocalDate createdAt;

    public static UserWorkoutDto from(UserWorkout entity) {
        UserWorkoutDto dto = new UserWorkoutDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setWeight(entity.getWeight());
        dto.setMemo(entity.getMemo());
        dto.setSuccessRate(entity.getSuccessRate());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public UserWorkout toEntity() {
        UserWorkout entity = new UserWorkout();
        entity.setId(this.id);
        entity.setUserId(this.userId);
        entity.setWeight(this.weight);
        entity.setMemo(this.memo);
        entity.setSuccessRate(this.successRate);
        entity.setCreatedAt(this.createdAt != null ? this.createdAt : LocalDate.now());
        return entity;
    }
}


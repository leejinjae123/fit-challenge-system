package com.fit.challenge.dto;

import com.fit.challenge.domain.Exercise;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class ExerciseDto {
    private Long id;
    private String exerciseName;
    private String description;
    private Integer recommendationScore;
    
    // 화면 표시용 (간단하게)
    private String levelCode;
    private String categoryCode;
    private String targetCode;

    // 추천 루틴용 정보 (기본값)
    private Integer sets;
    private Integer reps;
    private Integer targetCount; 

    public static ExerciseDto from(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setExerciseName(exercise.getExerciseName());
        dto.setDescription(exercise.getDescription());
        dto.setRecommendationScore(exercise.getRecommendationScore());
        
        if (exercise.getLevel() != null) dto.setLevelCode(exercise.getLevel().getCodeId());
        if (exercise.getCategory() != null) dto.setCategoryCode(exercise.getCategory().getCodeId());
        if (exercise.getTarget() != null) dto.setTargetCode(exercise.getTarget().getCodeId());
        
        return dto;
    }
}

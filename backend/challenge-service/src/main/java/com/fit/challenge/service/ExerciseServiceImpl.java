package com.fit.challenge.service;

import com.fit.challenge.domain.Exercise;
import com.fit.challenge.dto.ExerciseDto;
import com.fit.challenge.repository.ExerciseRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExerciseDto> getRecommendedExercises(String levelCode) {
        List<Exercise> exercises;

        if (levelCode != null && !levelCode.isEmpty()) {
            exercises = exerciseRepository.findByLevelCodeIdOrderByRecommendationScoreDesc(levelCode);
        } else {
            exercises = exerciseRepository.findAllByOrderByRecommendationScoreDesc();
        }

        // 상위 10개만 추천
        return exercises.stream()
                .limit(10)
                .map(this::convertToDtoWithTargetCount)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExerciseDto> getAllExercises(Pageable pageable, String search, String levelCode, String categoryCode, String targetCode) {
        Specification<Exercise> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(root.get("exerciseName"), "%" + search + "%"));
            }
            if (levelCode != null && !levelCode.isEmpty()) {
                predicates.add(cb.equal(root.get("level").get("codeId"), levelCode));
            }
            if (categoryCode != null && !categoryCode.isEmpty()) {
                predicates.add(cb.equal(root.get("category").get("codeId"), categoryCode));
            }
            if (targetCode != null && !targetCode.isEmpty()) {
                predicates.add(cb.equal(root.get("target").get("codeId"), targetCode));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return exerciseRepository.findAll(spec, pageable)
                .map(this::convertToDtoWithTargetCount);
    }

    private ExerciseDto convertToDtoWithTargetCount(Exercise exercise) {
        ExerciseDto dto = ExerciseDto.from(exercise);

        // 운동 유형에 따라 목표 횟수/시간 설정 (추천 기본값)
        String categoryCode = dto.getCategoryCode();
        if ("C_CD".equals(categoryCode)) {
            // 유산소는 20~30분
            dto.setSets(1);
            dto.setReps(30);
            dto.setTargetCount(30); 
        } else if ("C_MB".equals(categoryCode)) {
            // 스트레칭은 1세트 10회
            dto.setSets(1);
            dto.setReps(10);
            dto.setTargetCount(10);
        } else {
            // 근력 운동은 3세트 12회 기본
            dto.setSets(3);
            dto.setReps(12);
            dto.setTargetCount(36);
        }

        return dto;
    }
}

package com.fit.challenge.repository;

import com.fit.challenge.domain.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long>, JpaSpecificationExecutor<Exercise> {
    
    // 명칭 포함 검색 (페이징)
    Page<Exercise> findByExerciseNameContaining(String name, Pageable pageable);

    // 특정 레벨의 운동을 추천 점수가 높은 순으로 조회
    @Query("SELECT e FROM Exercise e WHERE e.level.codeId = :levelCode ORDER BY e.recommendationScore DESC")
    List<Exercise> findByLevelCodeIdOrderByRecommendationScoreDesc(@Param("levelCode") String levelCode);

    // 전체 운동을 추천 점수가 높은 순으로 조회
    @Query("SELECT e FROM Exercise e ORDER BY e.recommendationScore DESC")
    List<Exercise> findAllByOrderByRecommendationScoreDesc();

    // 운동 명칭 리스트로 해당 운동들의 타겟 부위 코드 조회
    @Query("SELECT DISTINCT e.target.codeId FROM Exercise e WHERE e.exerciseName IN :exerciseNames")
    List<String> findTargetCodesByExerciseNames(@Param("exerciseNames") List<String> exerciseNames);

    // 특정 레벨에서 특정 부위들을 제외하고 추천 점수 순으로 조회
    @Query("SELECT e FROM Exercise e WHERE e.level.codeId = :levelCode AND e.target.codeId NOT IN :excludedTargetCodes ORDER BY e.recommendationScore DESC")
    List<Exercise> findByLevelCodeIdAndTargetCodeIdNotIn(@Param("levelCode") String levelCode, @Param("excludedTargetCodes") List<String> excludedTargetCodes);

    // 전체에서 특정 부위들을 제외하고 추천 점수 순으로 조회
    @Query("SELECT e FROM Exercise e WHERE e.target.codeId NOT IN :excludedTargetCodes ORDER BY e.recommendationScore DESC")
    List<Exercise> findByTargetCodeIdNotIn(@Param("excludedTargetCodes") List<String> excludedTargetCodes);
}

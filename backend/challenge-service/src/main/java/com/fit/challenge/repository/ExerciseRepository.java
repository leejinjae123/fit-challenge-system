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
}

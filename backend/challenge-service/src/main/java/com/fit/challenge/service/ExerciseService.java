package com.fit.challenge.service;

import com.fit.challenge.dto.ExerciseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

/**
 * 운동(Exercise) 정보 및 추천 서비스 인터페이스
 */
public interface ExerciseService {

    /**
     * 사용자 레벨 및 최근 운동 기록에 맞는 추천 운동 목록 조회
     * @param levelCode 사용자 레벨 코드 (L10, L20, L30)
     * @param userId 사용자 ID (최근 운동 부위 제외를 위해 사용)
     * @return 추천 운동 DTO 리스트
     */
    List<ExerciseDto> getRecommendedExercises(String levelCode, Long userId);

    /**
     * 전체 운동 목록 조회 (페이징, 검색 및 필터링 지원)
     * @param pageable 페이징 정보
     * @param search 검색어 (운동 명칭)
     * @param levelCode 난이도 필터
     * @param categoryCode 유형 필터
     * @param targetCode 부위 필터
     * @return 페이징된 운동 DTO 리스트
     */
    Page<ExerciseDto> getAllExercises(Pageable pageable, String search, String levelCode, String categoryCode, String targetCode);
}

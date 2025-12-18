package com.fit.challenge.controller;

import com.fit.challenge.dto.ExerciseDto;
import com.fit.challenge.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    // 추천 루틴 조회
    @GetMapping("/recommendation")
    public ResponseEntity<List<ExerciseDto>> getRecommendations(@RequestParam(value = "levelCode", required = false) String levelCode) {
        return ResponseEntity.ok(exerciseService.getRecommendedExercises(levelCode));
    }

    // 전체 운동 목록 조회 (페이징, 검색 및 필터링)
    @GetMapping
    public ResponseEntity<Page<ExerciseDto>> getAllExercises(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "levelCode", required = false) String levelCode,
            @RequestParam(value = "categoryCode", required = false) String categoryCode,
            @RequestParam(value = "targetCode", required = false) String targetCode) {
        return ResponseEntity.ok(exerciseService.getAllExercises(pageable, search, levelCode, categoryCode, targetCode));
    }
}

package com.fit.challenge.controller;

import com.fit.challenge.dto.WorkoutRecordDto;
import com.fit.challenge.service.WorkoutRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workout-records")
@RequiredArgsConstructor
public class WorkoutRecordController {

    private final WorkoutRecordService workoutRecordService;

    @PostMapping
    public ResponseEntity<WorkoutRecordDto> createWorkoutRecord(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody WorkoutRecordDto dto) {
        if (userId == null) {
             userId = 1L; // Dev default
        }
        dto.setUserId(userId);
        return ResponseEntity.ok(workoutRecordService.createWorkoutRecord(dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<WorkoutRecordDto>> getMyWorkoutRecords(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            userId = 1L; 
        }
        return ResponseEntity.ok(workoutRecordService.getWorkoutRecordsByUserId(userId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<WorkoutRecordDto> completeWorkoutRecord(
            @PathVariable("id") Long recordId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) userId = 1L;
        return ResponseEntity.ok(workoutRecordService.completeWorkoutRecord(recordId, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkoutRecord(
            @PathVariable("id") Long recordId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) userId = 1L;
        workoutRecordService.deleteWorkoutRecord(recordId, userId);
        return ResponseEntity.noContent().build();
    }
}

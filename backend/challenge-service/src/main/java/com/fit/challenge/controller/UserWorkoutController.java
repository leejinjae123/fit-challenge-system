package com.fit.challenge.controller;

import com.fit.challenge.dto.UserWorkoutDto;
import com.fit.challenge.service.UserWorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user-workouts")
@RequiredArgsConstructor
public class UserWorkoutController {

    private final UserWorkoutService userWorkoutService;

    @PostMapping
    public ResponseEntity<UserWorkoutDto> saveUserWorkout(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody UserWorkoutDto dto) {
        if (userId == null) userId = 1L;
        dto.setUserId(userId);
        return ResponseEntity.ok(userWorkoutService.saveUserWorkout(dto));
    }

    @GetMapping
    public ResponseEntity<List<UserWorkoutDto>> getUserWorkouts(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) userId = 1L;
        return ResponseEntity.ok(userWorkoutService.getUserWorkouts(userId));
    }
}


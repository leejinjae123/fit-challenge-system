package com.fit.challenge.service;

import com.fit.challenge.dto.UserWorkoutDto;
import java.util.List;

public interface UserWorkoutService {
    UserWorkoutDto saveUserWorkout(UserWorkoutDto dto);
    List<UserWorkoutDto> getUserWorkouts(Long userId);
}


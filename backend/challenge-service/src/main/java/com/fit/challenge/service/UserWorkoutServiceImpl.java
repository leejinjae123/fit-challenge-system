package com.fit.challenge.service;

import com.fit.challenge.domain.RecordStatus;
import com.fit.challenge.domain.UserWorkout;
import com.fit.challenge.domain.WorkoutRecord;
import com.fit.challenge.dto.UserWorkoutDto;
import com.fit.challenge.repository.UserWorkoutRepository;
import com.fit.challenge.repository.WorkoutRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserWorkoutServiceImpl implements UserWorkoutService {

    private final UserWorkoutRepository userWorkoutRepository;
    private final WorkoutRecordRepository workoutRecordRepository;

    @Override
    @Transactional
    public UserWorkoutDto saveUserWorkout(UserWorkoutDto dto) {
        LocalDate today = dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDate.now();
        
        // 1. 해당 날짜의 운동 성공률 계산
        List<WorkoutRecord> dailyRecords = workoutRecordRepository.findByUserIdAndPlanDate(dto.getUserId(), today);
        double successRate = 0.0;
        
        if (!dailyRecords.isEmpty()) {
            long completedCount = dailyRecords.stream()
                    .filter(r -> r.getStatus() == RecordStatus.COMPLETED)
                    .count();
            successRate = (double) completedCount / dailyRecords.size() * 100.0;
        }

        // 2. 이미 해당 날짜의 기록이 있는지 확인 (있으면 업데이트, 없으면 신규 생성)
        UserWorkout userWorkout = userWorkoutRepository.findByUserIdAndCreatedAt(dto.getUserId(), today)
                .orElse(new UserWorkout());

        userWorkout.setUserId(dto.getUserId());
        userWorkout.setWeight(dto.getWeight());
        userWorkout.setMemo(dto.getMemo());
        userWorkout.setSuccessRate(successRate);
        userWorkout.setCreatedAt(today);

        UserWorkout saved = userWorkoutRepository.save(userWorkout);
        return UserWorkoutDto.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserWorkoutDto> getUserWorkouts(Long userId) {
        return userWorkoutRepository.findByUserIdOrderByCreatedAtAsc(userId).stream()
                .map(UserWorkoutDto::from)
                .collect(Collectors.toList());
    }
}


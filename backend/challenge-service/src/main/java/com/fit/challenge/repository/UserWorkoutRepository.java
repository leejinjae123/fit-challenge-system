package com.fit.challenge.repository;

import com.fit.challenge.domain.UserWorkout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface UserWorkoutRepository extends JpaRepository<UserWorkout, Long> {
    List<UserWorkout> findByUserIdOrderByCreatedAtAsc(Long userId);
    Optional<UserWorkout> findByUserIdAndCreatedAt(Long userId, LocalDate createdAt);
}


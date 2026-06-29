package com.fit.challenge.repository;

import com.fit.challenge.domain.Challenge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByActiveTrueOrderByIdAsc();
}

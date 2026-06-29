package com.fit.challenge.repository;

import com.fit.challenge.domain.UserChallenge;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserChallengeRepository extends JpaRepository<UserChallenge, Long> {
    List<UserChallenge> findByUserId(Long userId);

    Optional<UserChallenge> findByUserIdAndChallengeId(Long userId, Long challengeId);
}

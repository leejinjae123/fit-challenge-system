package com.fit.challenge.service;

import com.fit.challenge.domain.Challenge;
import com.fit.challenge.domain.RecordStatus;
import com.fit.challenge.domain.UserChallenge;
import com.fit.challenge.domain.UserWorkout;
import com.fit.challenge.dto.ChallengeDto;
import com.fit.challenge.repository.ChallengeRepository;
import com.fit.challenge.repository.UserChallengeRepository;
import com.fit.challenge.repository.UserWorkoutRepository;
import com.fit.challenge.repository.WorkoutRecordRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;
    private final WorkoutRecordRepository workoutRecordRepository;
    private final UserWorkoutRepository userWorkoutRepository;
    private final RedissonClient redissonClient;

    @Override
    @Transactional(readOnly = true)
    public List<ChallengeDto> getChallenges(Long userId) {
        Map<Long, UserChallenge> joined = userChallengeRepository.findByUserId(userId).stream()
                .collect(Collectors.toMap(item -> item.getChallenge().getId(), item -> item));

        return challengeRepository.findByActiveTrueOrderByIdAsc().stream()
                .map(challenge -> ChallengeDto.from(challenge, joined.get(challenge.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChallengeDto joinChallenge(Long challengeId, Long userId) {
        return withLock("lock:challenge:join:" + challengeId, () -> {
            Challenge challenge = getChallenge(challengeId);
            userChallengeRepository.findByUserIdAndChallengeId(userId, challengeId)
                    .ifPresent(item -> {
                        throw new IllegalStateException("이미 참가한 챌린지입니다.");
                    });

            if (challenge.getParticipantCount() >= challenge.getCapacity()) {
                throw new IllegalStateException("참가 인원이 마감되었습니다.");
            }

            UserChallenge userChallenge = new UserChallenge();
            userChallenge.setUserId(userId);
            userChallenge.setChallenge(challenge);
            userChallenge.setProgressCount(calculateProgress(challenge, userId));
            challenge.setParticipantCount(challenge.getParticipantCount() + 1);

            return ChallengeDto.from(challenge, userChallengeRepository.save(userChallenge));
        });
    }

    @Override
    @Transactional
    public ChallengeDto completeChallenge(Long challengeId, Long userId) {
        return withLock("lock:challenge:complete:" + challengeId + ":" + userId, () -> {
            Challenge challenge = getChallenge(challengeId);
            UserChallenge userChallenge = userChallengeRepository.findByUserIdAndChallengeId(userId, challengeId)
                    .orElseThrow(() -> new IllegalStateException("먼저 챌린지에 참가해주세요."));

            int progress = calculateProgress(challenge, userId);
            userChallenge.setProgressCount(progress);
            if (progress < challenge.getTargetValue()) {
                return ChallengeDto.from(challenge, userChallenge);
            }

            userChallenge.setStatus("COMPLETED");
            userChallenge.setCompletedAt(LocalDateTime.now());
            return ChallengeDto.from(challenge, userChallenge);
        });
    }

    private Challenge getChallenge(Long challengeId) {
        return challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));
    }

    private int calculateProgress(Challenge challenge, Long userId) {
        if ("SUCCESS_RATE".equals(challenge.getTargetType())) {
            return userWorkoutRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                    .map(UserWorkout::getSuccessRate)
                    .map(Double::intValue)
                    .orElse(0);
        }

        return (int) workoutRecordRepository.countByUserIdAndStatus(userId, RecordStatus.COMPLETED);
    }

    private <T> T withLock(String key, Supplier<T> logic) {
        RLock lock = redissonClient.getLock(key);
        try {
            if (!lock.tryLock(10, 3, TimeUnit.SECONDS)) {
                throw new IllegalStateException("서버가 혼잡합니다. 잠시 후 다시 시도해주세요.");
            }
            return logic.get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("요청 처리 중 인터럽트가 발생했습니다.");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}

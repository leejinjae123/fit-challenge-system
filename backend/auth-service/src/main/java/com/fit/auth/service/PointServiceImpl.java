package com.fit.auth.service;

import com.fit.auth.repository.UserRepository;
import com.fit.auth.domain.User;
import com.fit.auth.support.RedisLockFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * 포인트 관리 서비스 구현체
 * <p>
 * Redis 분산 락(Redisson)을 사용하여 포인트 충전 시의 동시성 이슈를 해결합니다.
 */
@Service
@RequiredArgsConstructor
public class PointServiceImpl implements PointService {

    private final UserRepository userRepository;
    private final RedisLockFacade redisLockFacade;
    private final TransactionTemplate transactionTemplate;

    /**
     * 포인트 충전 (동시성 제어 적용)
     * <p>
     * <b>로직 흐름:</b>
     * <ol>
     *     <li>Redis 락 획득 시도 (Key: "lock:user:points:{userId}")</li>
     *     <li>락 획득 성공 시, {@link TransactionTemplate}을 사용하여 DB 트랜잭션 시작</li>
     *     <li>사용자 조회 및 포인트 증가</li>
     *     <li>트랜잭션 커밋 (DB 반영)</li>
     *     <li>Redis 락 해제</li>
     * </ol>
     * <p>
     * <b>주의사항:</b>
     * @Transactional 어노테이션 대신 TransactionTemplate을 사용하는 이유는
     * AOP 기반의 @Transactional이 락 해제보다 늦게 끝날 경우(커밋 시점 차이),
     * 다른 스레드가 변경 전 데이터를 읽을 수 있는 문제를 방지하기 위함입니다.
     */
    @Override
    public void chargePoints(Long userId, Long amount) {
        String lockKey = "lock:user:points:" + userId;

        // 분산 락 안에서 트랜잭션 실행
        redisLockFacade.executeWithLock(lockKey, () -> {
            transactionTemplate.execute(status -> {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));

                // 포인트 증가 (Dirty Checking에 의해 자동 저장)
                user.setPoints(user.getPoints() + amount);

                return null;
            });
        });
    }
}

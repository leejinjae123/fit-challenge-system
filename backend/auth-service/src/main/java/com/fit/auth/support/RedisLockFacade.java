package com.fit.auth.support;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisLockFacade {

    private final RedissonClient redissonClient;

    public void executeWithLock(String key, Runnable logic) {
        RLock lock = redissonClient.getLock(key);
        try {
            // 10초 대기, 3초 락 점유
            boolean available = lock.tryLock(10, 3, TimeUnit.SECONDS);
            if (!available) {
                log.error("Lock 획득 실패: {}", key);
                throw new RuntimeException("서버가 혼잡합니다. 잠시 후 다시 시도해주세요.");
            }
            logic.run();
        } catch (InterruptedException e) {
            log.error("Lock 인터럽트 발생: {}", key);
            Thread.currentThread().interrupt();
            throw new RuntimeException("인터럽트가 발생했습니다.");
        } finally {
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}



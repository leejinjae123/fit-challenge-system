package com.fit.auth.service;

import com.fit.auth.domain.User;
import com.fit.auth.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class PointServiceConcurrencyTest {

    @Autowired
    private PointService pointService;

    @Autowired
    private UserRepository userRepository;

    private Long userId;

    @BeforeEach
    void setUp() {
        // 테스트용 유저 생성
        User user = new User();
        user.setEmail("test@concurrency.com");
        user.setPassword("password");
        user.setNickname("tester");
        user.setPoints(0L);
        userRepository.save(user);
        userId = user.getId();
    }

    @AfterEach
    void tearDown() {
        // 테스트 후 데이터 정리
        if (userId != null) {
            userRepository.deleteById(userId);
        }
    }

    @Test
    @DisplayName("동시에 100명이 1포인트씩 충전하면 100포인트가 되어야 한다")
    void concurrencyTest_ChargePoints() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    pointService.chargePoints(userId, 1L);
                } catch (Exception e) {
                    System.err.println("Error: " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();

        User user = userRepository.findById(userId).orElseThrow();
        assertThat(user.getPoints()).isEqualTo(100L);
    }
}

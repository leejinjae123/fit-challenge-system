package com.fit.challenge.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() throws IOException {
        Config config = new Config();
        // Redis 주소 설정 (redis:// 접두사 필수)
        config.useSingleServer()
              .setAddress("redis://" + redisHost + ":" + redisPort)
              .setConnectTimeout(10000) // 연결 타임아웃 10초
              .setTimeout(10000)        // 응답 타임아웃 10초
              .setRetryAttempts(3)
              .setRetryInterval(1500);

        return Redisson.create(config);
    }
}


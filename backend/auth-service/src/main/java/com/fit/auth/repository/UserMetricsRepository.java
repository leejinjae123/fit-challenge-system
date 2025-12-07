package com.fit.auth.repository;

import com.fit.auth.domain.UserMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMetricsRepository extends JpaRepository<UserMetrics, Long> {
}


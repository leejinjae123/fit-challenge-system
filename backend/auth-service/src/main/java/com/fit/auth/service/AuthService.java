package com.fit.auth.service;

import com.fit.auth.domain.User;
import com.fit.auth.domain.UserMetrics;
import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.repository.UserMetricsRepository;
import com.fit.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMetricsRepository userMetricsRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void processOnboarding(OnboardingRequestDto dto) {
        // 1. 이메일 중복 체크
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 2. User 생성 (비밀번호 암호화)
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // 암호화 저장
        user.setNickname(dto.getNickname());
        user.setIsOnboarded(true);

        // 3. UserMetrics 생성
        UserMetrics metrics = new UserMetrics();
        metrics.setUser(user);
        metrics.setHeight(dto.getHeight());
        metrics.setWeight(dto.getWeight());
        metrics.setSquatOneRm(dto.getSquatOneRm());
        metrics.setWeeklyGoal(dto.getWeeklyGoal());

        // 4. 저장 (CascadeType.ALL 덕분에 User 저장 시 Metrics도 같이 저장됨)
        // 양방향 연관관계 편의 메서드나 수동 설정 필요할 수 있음
        user.setUserMetrics(metrics);
        userRepository.save(user);
    }
}

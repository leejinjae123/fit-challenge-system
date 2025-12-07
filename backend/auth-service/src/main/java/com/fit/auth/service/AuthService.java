package com.fit.auth.service;

import com.fit.auth.domain.User;
import com.fit.auth.domain.UserMetrics;
import com.fit.auth.dto.LoginRequestDto;
import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.dto.UserResponseDto;
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
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        user.setIsOnboarded(true);

        UserMetrics metrics = new UserMetrics();
        metrics.setUser(user);
        metrics.setHeight(dto.getHeight());
        metrics.setWeight(dto.getWeight());
        metrics.setSquatOneRm(dto.getSquatOneRm());
        metrics.setWeeklyGoal(dto.getWeeklyGoal());

        user.setUserMetrics(metrics);
        userRepository.save(user);
    }

    // 로그인 로직
    @Transactional(readOnly = true)
    public UserResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // TODO: JWT 토큰 발급 로직 추가 필요
        // 지금은 유저 정보만 반환
        return UserResponseDto.from(user);
    }

    // 내 정보 조회
    @Transactional(readOnly = true)
    public UserResponseDto getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return UserResponseDto.from(user);
    }
}

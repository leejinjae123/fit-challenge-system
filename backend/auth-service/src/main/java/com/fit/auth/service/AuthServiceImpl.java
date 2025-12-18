package com.fit.auth.service;

import com.fit.auth.domain.User;
import com.fit.auth.domain.UserMetrics;
import com.fit.auth.dto.LoginRequestDto;
import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.dto.UserResponseDto;
import com.fit.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 및 사용자 관리 서비스 구현체
 * <p>
 * {@link AuthService} 인터페이스를 구현하며, 실제 비즈니스 로직을 수행합니다.
 * JPA Repository를 사용하여 DB와 통신합니다.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 온보딩(회원가입) 로직 구현
     * <ol>
     *     <li>이메일 중복 체크</li>
     *     <li>비밀번호 암호화</li>
     *     <li>User 엔티티 및 UserMetrics 엔티티 생성 및 연관관계 설정</li>
     *     <li>DB 저장</li>
     * </ol>
     */
    @Override
    @Transactional
    public void processOnboarding(OnboardingRequestDto dto) {
        // 1. 이메일 중복 검증
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 2. User 엔티티 생성
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // 비밀번호 암호화 필수
        user.setNickname(dto.getNickname());
        user.setIsOnboarded(true);

        // 3. UserMetrics(신체 정보) 엔티티 생성
        UserMetrics metrics = new UserMetrics();
        metrics.setUser(user); // 양방향 매핑 (필요 시)
        metrics.setHeight(dto.getHeight());
        metrics.setWeight(dto.getWeight());
        metrics.setLevelCode(dto.getLevelCode());
        metrics.setWeeklyGoal(dto.getWeeklyGoal());

        // 4. 연관관계 설정 및 저장 (Cascade 옵션에 따라 metrics도 함께 저장될 수 있음)
        user.setUserMetrics(metrics);
        userRepository.save(user);
    }

    /**
     * 로그인 로직 구현
     * <p>
     * DB에서 이메일로 사용자를 찾고, 암호화된 비밀번호를 비교합니다.
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        // 비밀번호 일치 여부 확인 (rawPassword, encodedPassword)
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // TODO: 추후 JWT 토큰 생성 및 반환 로직 추가 필요
        return UserResponseDto.from(user);
    }

    /**
     * 내 정보 조회 구현
     */
    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return UserResponseDto.from(user);
    }

    /**
     * 닉네임 변경 구현 (TDD 예시)
     */
    @Override
    @Transactional
    public void updateNickname(Long userId, String newNickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 유효성 검증
        if (newNickname == null || newNickname.trim().isEmpty()) {
            throw new IllegalArgumentException("Nickname cannot be empty");
        }

        // 변경 감지(Dirty Checking)를 통해 트랜잭션 종료 시 자동 UPDATE 쿼리 발생
        user.setNickname(newNickname);
    }

}

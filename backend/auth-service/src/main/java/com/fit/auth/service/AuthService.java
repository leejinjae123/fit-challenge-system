package com.fit.auth.service;

import com.fit.auth.domain.User;
import com.fit.auth.domain.UserMetrics;
import com.fit.auth.dto.LoginRequestDto;
import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.dto.UserResponseDto;
import com.fit.auth.repository.UserRepository;
import com.fit.auth.support.RedisLockFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisLockFacade redisLockFacade;
    private final TransactionTemplate transactionTemplate;

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

    // 닉네임 변경 (TDD 구현 대상)
    @Transactional
    public void updateNickname(Long userId, String newNickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (newNickname == null || newNickname.trim().isEmpty()) {
            throw new IllegalArgumentException("Nickname cannot be empty");
        }
        
        user.setNickname(newNickname);
    }

    /**
     * 포인트 충전 (동시성 제어 적용)
     * 분산 락을 사용하여 여러 요청이 동시에 들어와도 순차적으로 처리되도록 보장합니다.
     * Transaction(DB반영)은 Lock 안에서 이루어져야 하며, 
     * Lock 해제 전에 커밋이 완료되어야 하므로 TransactionTemplate을 사용합니다.
     */
    public void chargePoints(Long userId, Long amount) {
        String lockKey = "lock:user:points:" + userId;
        
        redisLockFacade.executeWithLock(lockKey, () -> {
            transactionTemplate.execute(status -> {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found"));
                
                // 포인트 증가
                user.setPoints(user.getPoints() + amount);
                
                // Dirty Checking으로 인해 별도 save 호출 불필요하지만 명시적으로 할 수도 있음
                // userRepository.save(user); 
                return null;
            });
        });
    }
}

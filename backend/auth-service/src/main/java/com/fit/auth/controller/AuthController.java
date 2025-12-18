package com.fit.auth.controller;

import com.fit.auth.dto.LoginRequestDto;
import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.dto.UserResponseDto;
import com.fit.auth.service.AuthService;
import com.fit.auth.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PointService pointService;

    // 회원가입 (온보딩)
    @PostMapping("/users/onboarding")
    public ResponseEntity<String> submitOnboarding(@RequestBody OnboardingRequestDto requestDto) {
        authService.processOnboarding(requestDto);
        return ResponseEntity.ok("회원가입 및 온보딩이 완료되었습니다.");
    }

    // 로그인
    @PostMapping("/auth/login")
    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto requestDto) {
        UserResponseDto response = authService.login(requestDto);
        // 실제로는 헤더에 토큰을 담아줘야 함
        return ResponseEntity.ok(response);
    }

    // 내 정보 조회
    @GetMapping("/users/me")
    public ResponseEntity<UserResponseDto> getMyInfo(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        // Gateway에서 토큰 검증 후 userId를 헤더에 넣어준다고 가정
        UserResponseDto response = authService.getMyInfo(userId);
        return ResponseEntity.ok(response);
    }

    // 온보딩 상태 확인 (기존 유지)
    @GetMapping("/users/me/onboarding-status")
    public ResponseEntity<Boolean> getOnboardingStatus(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        UserResponseDto response = authService.getMyInfo(userId);
        return ResponseEntity.ok(response.getIsOnboarded());
    }
}

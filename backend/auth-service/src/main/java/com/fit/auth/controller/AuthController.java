package com.fit.auth.controller;

import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 온보딩 및 회원가입 API
    @PostMapping("/onboarding")
    public ResponseEntity<String> submitOnboarding(@RequestBody OnboardingRequestDto requestDto) {
        authService.processOnboarding(requestDto);
        return ResponseEntity.ok("회원가입 및 온보딩이 완료되었습니다.");
    }
    
    // 온보딩 여부 확인 API (프론트엔드 체크용)
    @GetMapping("/me/onboarding-status")
    public ResponseEntity<Boolean> getOnboardingStatus(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        // TODO: 실제 DB 조회 로직 구현 필요
        return ResponseEntity.ok(false); 
    }
}

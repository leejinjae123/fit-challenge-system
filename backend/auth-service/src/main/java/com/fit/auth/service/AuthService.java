package com.fit.auth.service;

import com.fit.auth.dto.LoginRequestDto;
import com.fit.auth.dto.OnboardingRequestDto;
import com.fit.auth.dto.UserResponseDto;

/**
 * 인증 및 사용자 관리 서비스 인터페이스
 * <p>
 * 회원가입(온보딩), 로그인, 내 정보 조회, 정보 수정 등의 기능을 정의합니다.
 */
public interface AuthService {

    /**
     * 사용자 온보딩(회원가입) 처리
     * <p>
     * 사용자 기본 정보와 신체 정보를 받아 새로운 사용자를 생성합니다.
     *
     * @param dto 온보딩 요청 데이터 (이메일, 비밀번호, 닉네임, 신체정보 등)
     */
    void processOnboarding(OnboardingRequestDto dto);

    /**
     * 로그인 처리
     * <p>
     * 이메일과 비밀번호를 검증하여 사용자 정보를 반환합니다.
     * 향후 JWT 토큰 발급 로직이 추가될 수 있습니다.
     *
     * @param dto 로그인 요청 데이터 (이메일, 비밀번호)
     * @return 로그인 성공 시 사용자 정보 DTO
     */
    UserResponseDto login(LoginRequestDto dto);

    /**
     * 내 정보 조회
     * <p>
     * 사용자 ID를 기반으로 사용자 상세 정보를 조회합니다.
     *
     * @param userId 조회할 사용자 ID
     * @return 사용자 정보 DTO
     */
    UserResponseDto getMyInfo(Long userId);

    /**
     * 내 정보 수정
     * <p>
     * 사용자의 닉네임, 키, 몸무게, 운동 레벨, 주간 목표를 수정합니다.
     *
     * @param userId 사용자 ID
     * @param dto    수정할 정보 DTO
     */
    void updateProfile(Long userId, com.fit.auth.dto.UserUpdateRequestDto dto);

}

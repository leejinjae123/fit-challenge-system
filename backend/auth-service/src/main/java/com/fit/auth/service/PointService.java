package com.fit.auth.service;

/**
 * 포인트 관리 서비스 인터페이스
 * <p>
 * 포인트 충전, 사용 등 포인트와 관련된 핵심 비즈니스 로직을 정의합니다.
 */
public interface PointService {

    /**
     * 포인트 충전
     * <p>
     * 동시성 제어가 필요한 메서드입니다.
     *
     * @param userId 충전할 사용자 ID
     * @param amount 충전할 포인트 양
     */
    void chargePoints(Long userId, Long amount);
}

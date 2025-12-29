package com.fit.auth.service;

import com.fit.auth.domain.User;
import com.fit.auth.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("회원 정보 변경 성공 테스트")
    void updateProfile_Success() {
        // given
        Long userId = 1L;
        com.fit.auth.dto.UserUpdateRequestDto dto = new com.fit.auth.dto.UserUpdateRequestDto();
        dto.setNickname("HealthyFit");
        dto.setHeight(175.0);
        dto.setWeight(70.0);
        dto.setLevelCode("L20");
        dto.setWeeklyGoal(5);

        User user = new User();
        user.setId(userId);
        user.setNickname("OldNick");
        
        com.fit.auth.domain.UserMetrics metrics = new com.fit.auth.domain.UserMetrics();
        metrics.setUser(user);
        user.setUserMetrics(metrics);

        // Mocking: 레포지토리가 이렇게 동작한다고 가정
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // when
        authService.updateProfile(userId, dto);

        // then
        assertThat(user.getNickname()).isEqualTo("HealthyFit");
        assertThat(user.getUserMetrics().getHeight()).isEqualTo(175.0);
        assertThat(user.getUserMetrics().getWeight()).isEqualTo(70.0);
        assertThat(user.getUserMetrics().getLevelCode()).isEqualTo("L20");
        assertThat(user.getUserMetrics().getWeeklyGoal()).isEqualTo(5);
    }
}

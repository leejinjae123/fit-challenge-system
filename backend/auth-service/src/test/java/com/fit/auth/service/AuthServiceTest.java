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
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("닉네임 변경 성공 테스트")
    void updateNickname_Success() {
        // given
        Long userId = 1L;
        String newNickname = "HealthyFit";
        User user = new User();
        user.setId(userId);
        user.setNickname("OldNick");

        // Mocking: 레포지토리가 이렇게 동작한다고 가정
        given(userRepository.findById(userId)).willReturn(Optional.of(user));

        // when
        authService.updateNickname(userId, newNickname);

        // then
        assertThat(user.getNickname()).isEqualTo(newNickname);
    }
}



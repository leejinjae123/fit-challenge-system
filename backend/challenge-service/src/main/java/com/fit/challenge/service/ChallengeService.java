package com.fit.challenge.service;

import com.fit.challenge.dto.ChallengeDto;
import java.util.List;

public interface ChallengeService {
    List<ChallengeDto> getChallenges(Long userId);

    ChallengeDto joinChallenge(Long challengeId, Long userId);

    ChallengeDto completeChallenge(Long challengeId, Long userId);
}

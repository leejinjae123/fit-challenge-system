package com.fit.challenge.dto;

import com.fit.challenge.domain.Challenge;
import com.fit.challenge.domain.UserChallenge;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChallengeDto {
    private Long id;
    private String title;
    private String description;
    private String targetType;
    private Integer targetValue;
    private Integer rewardPoints;
    private Integer capacity;
    private Integer participantCount;
    private Boolean active;
    private Boolean joined;
    private String status;
    private Integer progressCount;

    public static ChallengeDto from(Challenge challenge, UserChallenge userChallenge) {
        ChallengeDto dto = new ChallengeDto();
        dto.setId(challenge.getId());
        dto.setTitle(challenge.getTitle());
        dto.setDescription(challenge.getDescription());
        dto.setTargetType(challenge.getTargetType());
        dto.setTargetValue(challenge.getTargetValue());
        dto.setRewardPoints(challenge.getRewardPoints());
        dto.setCapacity(challenge.getCapacity());
        dto.setParticipantCount(challenge.getParticipantCount());
        dto.setActive(challenge.getActive());
        dto.setJoined(userChallenge != null);
        dto.setStatus(userChallenge != null ? userChallenge.getStatus() : "READY");
        dto.setProgressCount(userChallenge != null ? userChallenge.getProgressCount() : 0);
        return dto;
    }
}

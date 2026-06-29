package com.fit.challenge.controller;

import com.fit.challenge.dto.ChallengeDto;
import com.fit.challenge.service.ChallengeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<List<ChallengeDto>> getChallenges(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        return ResponseEntity.ok(challengeService.getChallenges(defaultUserId(userId)));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ChallengeDto> joinChallenge(
            @PathVariable("id") Long challengeId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        return ResponseEntity.ok(challengeService.joinChallenge(challengeId, defaultUserId(userId)));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ChallengeDto> completeChallenge(
            @PathVariable("id") Long challengeId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        return ResponseEntity.ok(challengeService.completeChallenge(challengeId, defaultUserId(userId)));
    }

    private Long defaultUserId(Long userId) {
        return userId != null ? userId : 1L;
    }
}

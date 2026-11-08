package com.mwc.wr.attempt.infrastructure.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.application.dto.AttemptRequestDto;
import com.mwc.wr.attempt.application.dto.AttemptResponseDto;
import com.mwc.wr.attempt.application.dto.ModerationStatsDto;
import com.mwc.wr.attempt.application.service.ListUserAttemptsService;
import com.mwc.wr.attempt.application.service.ModerationStatsService;
import com.mwc.wr.attempt.application.service.ReviewAttemptService;
import com.mwc.wr.attempt.application.service.SubmitAttemptService;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.shared.config.jwt.CustomUserDetails;

@RestController
@Validated
@RequestMapping("/attempt")
public class AttemptController {
    private final SubmitAttemptService submitService;
    private final ReviewAttemptService reviewService;
    private final ListUserAttemptsService listAttemptService;
    private final ModerationStatsService statsService;

    public AttemptController(SubmitAttemptService submitService, ReviewAttemptService reviewService,
            ListUserAttemptsService listAttemptService, ModerationStatsService statsService) {
        this.submitService = submitService;
        this.reviewService = reviewService;
        this.listAttemptService = listAttemptService;
        this.statsService = statsService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitAttempt(@AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody @Validated AttemptRequestDto dto) {
        submitService.submitAttempt(principal.getId(), dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/moderator/accept/{id}")
    public ResponseEntity<Void> acceptAttempt(@AuthenticationPrincipal CustomUserDetails moderator,
            @PathVariable Long id) {
        reviewService.acceptAttempt(id, moderator.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/moderator/reject/{id}")
    public ResponseEntity<Void> rejectAttempt(@AuthenticationPrincipal CustomUserDetails moderator,
            @PathVariable Long id) {
        reviewService.rejectAttempt(id, moderator.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/moderator/listAllAttempt")
    public ResponseEntity<List<AttemptResponseDto>> listAllAttempt() {
        return ResponseEntity.ok(listAttemptService.listAllAttempts());
    }

    @GetMapping("/moderator/listAllAttemptByCategory")
    public ResponseEntity<List<AttemptResponseDto>> listAllAttemptByCategory(@RequestParam Category category) {
        return ResponseEntity.ok(listAttemptService.listAllAttemptsByCategory(category));
    }

    @GetMapping("/moderator/listAllAttemptByStatus")
    public ResponseEntity<List<AttemptDetails>> listAllAttemptByStatus(@RequestParam AttemptStatus status) {
        return ResponseEntity.ok(listAttemptService.listAllAttemptsByStatus(status));
    }

    @GetMapping("/moderator/listAllAttemptByUserId")
    public ResponseEntity<List<AttemptResponseDto>> listAllAttemptByUserId(@RequestParam UUID userId) {
        return ResponseEntity.ok(listAttemptService.listUserAttempts(userId));
    }

    @GetMapping("/moderator/listApprovedNonRecordByCategory")
    public ResponseEntity<List<AttemptDetails>> listApprovedNonRecordByCategory(@RequestParam Category category) {
        return ResponseEntity.ok(listAttemptService.listApprovedNonRecordAttempts(category));
    }

    @GetMapping("/moderator/history")
    public ResponseEntity<List<AttemptDetails>> listReviewHistory(
            @RequestParam(required = false) AttemptStatus status) {
        return ResponseEntity.ok(listAttemptService.listReviewHistory(status));
    }

    @GetMapping("/moderator/stats")
    public ResponseEntity<ModerationStatsDto> getStats(
            @RequestParam(defaultValue = "7") @Min(value = 1, message = "Days must be between 1 and 90")
            @Max(value = 90, message = "Days must be between 1 and 90") int days) {
        return ResponseEntity.ok(statsService.getStats(days));
    }

    @GetMapping("/moderator/{id}")
    public ResponseEntity<AttemptDetails> getAttempt(@PathVariable Long id) {
        return ResponseEntity.ok(listAttemptService.getAttemptDetails(id));
    }
}

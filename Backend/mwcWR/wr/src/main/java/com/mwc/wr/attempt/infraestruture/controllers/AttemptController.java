package com.mwc.wr.attempt.infraestruture.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mwc.wr.attempt.application.dto.AttemptRequestDto;
import com.mwc.wr.attempt.application.dto.AttemptResponseDto;
import com.mwc.wr.attempt.application.service.ListUserAttemptsService;
import com.mwc.wr.attempt.application.service.RewiewAttemptService;
import com.mwc.wr.attempt.application.service.SubmitAttemptService;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/attempt")
public class AttemptController {

    private final SubmitAttemptService submitService;
    private final RewiewAttemptService rewiewService;
    private final ListUserAttemptsService listAttemptService;

    public AttemptController(SubmitAttemptService submitService, RewiewAttemptService rewiewService,
            ListUserAttemptsService listAttemptService) {
        this.submitService = submitService;
        this.rewiewService = rewiewService;
        this.listAttemptService = listAttemptService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitAttempt(@RequestBody @Validated AttemptRequestDto dto) {
        submitService.submitAttempt(dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/moderator/accept/{id}")
    public ResponseEntity<Void> acceptAttempt(@PathVariable Long id) {
        rewiewService.acceptAttempt(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/moderator/reject/{id}")
    public ResponseEntity<Void> rejectAttempt(@PathVariable Long id) {
        rewiewService.acceptAttempt(id);
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
    public ResponseEntity<List<AttemptResponseDto>> listAllAttemptByStatus(@RequestParam AttemptStatus status) {
        return ResponseEntity.ok(listAttemptService.listAllAttemptsByStatus(status));
    }

    @GetMapping("/moderator/listAllAttemptByUserId/{userId}")
    public ResponseEntity<List<AttemptResponseDto>> listAllAttemptByStatus(@PathVariable UUID userId) {
        return ResponseEntity.ok(listAttemptService.listUserAttempts(userId));
    }

}

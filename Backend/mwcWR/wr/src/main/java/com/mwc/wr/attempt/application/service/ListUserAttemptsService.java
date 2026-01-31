package com.mwc.wr.attempt.application.service;

import java.util.List;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptResponseDto;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;

@Service
public class ListUserAttemptsService {
    private final AttemptRepository attemptRepository;

    public ListUserAttemptsService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public List<AttemptResponseDto> listUserAttempts(UUID userId) {
        var attempts = attemptRepository.findAllByUserId(userId);
        return attempts.stream()
                .map(attempt -> new AttemptResponseDto(
                        attempt.getIdAttempt(),
                        attempt.getUserId(),
                        attempt.getVideoLink(),
                        attempt.getAttemptTime(),
                        attempt.getAttemptCategory()))
                .toList();
    }

    public List<AttemptResponseDto> listAllAttemptsByCategory(Category category) {
        var attempts = attemptRepository.findAllByAttemptCategory(category);
        return attempts.stream()
                .map(attempt -> new AttemptResponseDto(
                        attempt.getIdAttempt(),
                        attempt.getUserId(),
                        attempt.getVideoLink(),
                        attempt.getAttemptTime(),
                        attempt.getAttemptCategory()))
                .toList();
    }

    public List<AttemptResponseDto> listAllAttempts() {
        var attempts = attemptRepository.findAll();
        return attempts.stream()
                .map(attempt -> new AttemptResponseDto(
                        attempt.getIdAttempt(),
                        attempt.getUserId(),
                        attempt.getVideoLink(),
                        attempt.getAttemptTime(),
                        attempt.getAttemptCategory()))
                .toList();
    }

    public List<AttemptResponseDto> listAllAttemptsByStatus(AttemptStatus status) {
        var attempts = attemptRepository.findAllByAttemptStatus(status);
        return attempts.stream()
                .map(attempt -> new AttemptResponseDto(
                        attempt.getIdAttempt(),
                        attempt.getUserId(),
                        attempt.getVideoLink(),
                        attempt.getAttemptTime(),
                        attempt.getAttemptCategory()))
                .toList();
    }
}

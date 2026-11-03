package com.mwc.wr.attempt.application.dto;

import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

public record AttemptResponseDto(Long idAttempt, UUID userId, String videoLink, LocalTime attemptTime,
        Category attemptCategory, AttemptStatus status) {

}

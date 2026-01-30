package com.mwc.wr.attempt.application.dto;

import java.time.LocalTime;

import com.mwc.wr.attempt.domain.model.Category;

public record AttemptResponseDto(Long idAttempt, String userId, String videoLink, LocalTime attemptTime,
        Category attemptCategory) {

}

package com.mwc.wr.attempt.application.dto;

import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

import jakarta.validation.constraints.NotBlank;

public record AttemptRequestDto(@NotBlank(message = "User ID cannot be blank") UUID userId,
        @NotBlank(message = "Video link cannot be blank") String videoLink,
        @NotBlank(message = "Attempt time cannot be blank") LocalTime attemptTime,
        @NotBlank(message = "Attempt description cannot be blank") String attempt_description,
        @NotBlank(message = "Attempt category cannot be blank") Category attemptCategory,
        @NotBlank(message = "Attempt status cannot be blank") AttemptStatus attemptStatus) {

}

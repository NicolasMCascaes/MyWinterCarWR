package com.mwc.wr.attempt.application.dto;

import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AttemptRequestDto(@NotNull(message = "User ID cannot be blank") UUID userId,
                @NotBlank(message = "Video link cannot be blank") String videoLink,
                @NotNull(message = "Attempt time cannot be blank") LocalTime attemptTime,
                @NotBlank(message = "Attempt description cannot be blank") String attemptDescription,
                @NotNull(message = "Attempt category cannot be blank") Category attemptCategory,
                @NotNull(message = "Attempt status cannot be blank") AttemptStatus attemptStatus) {

}

package com.mwc.wr.attempt.application.dto;

import java.time.LocalTime;

import com.mwc.wr.attempt.domain.model.Category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AttemptRequestDto(
                @NotBlank(message = "Video link cannot be blank") String videoLink,
                @NotNull(message = "Attempt time cannot be blank") LocalTime attemptTime,
                @Size(max = 256, message = "Attempt description must have at most 256 characters") String attemptDescription,
                @NotNull(message = "Attempt category cannot be blank") Category attemptCategory) {

}

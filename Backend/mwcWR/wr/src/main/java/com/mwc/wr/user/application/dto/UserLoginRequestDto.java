package com.mwc.wr.user.application.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginRequestDto(@NotBlank(message = "Email cannot be blank") String email,
        @NotBlank(message = "password cannot be blank") String password) {
}

package com.mwc.wr.user.application.dto;

import com.mwc.wr.user.domain.model.Roles;

import jakarta.validation.constraints.NotBlank;

public record UserRequestDto(@NotBlank(message = "Field email can not be null") String email,
                @NotBlank(message = "Field password can not be null") String password,
                @NotBlank(message = "Username can not be null") String username, Roles roles) {
}

package com.mwc.wr.user.application.dto;

import com.mwc.wr.user.domain.model.Roles;

import jakarta.validation.constraints.NotNull;

public record UpdateRoleRequestDto(@NotNull(message = "Role cannot be null") Roles role) {
}

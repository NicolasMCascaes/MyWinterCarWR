package com.mwc.wr.user.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRequestDto(
        @NotBlank(message = "Field email can not be null")
        @Email(message = "Email must be valid")
        @Size(max = 256, message = "Email must have at most 256 characters") String email,
        @NotBlank(message = "Field password can not be null")
        @Size(min = 8, max = 128, message = "Password must have between 8 and 128 characters") String password,
        @NotBlank(message = "Username can not be null")
        @Size(min = 3, max = 20, message = "Username must have between 3 and 20 characters")
        @Pattern(regexp = "^[\\p{L}\\p{N}_-]+$", message = "Username can only contain letters, numbers, - and _")
        String username,
        @NotBlank(message = "Country can not be null") String country) {
}

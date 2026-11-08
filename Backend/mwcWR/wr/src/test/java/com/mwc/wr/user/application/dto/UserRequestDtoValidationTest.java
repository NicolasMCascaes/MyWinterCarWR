package com.mwc.wr.user.application.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class UserRequestDtoValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    private Set<String> invalidFields(UserRequestDto dto) {
        return validator.validate(dto).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());
    }

    @Test
    void acceptsValidRegistration() {
        assertTrue(invalidFields(new UserRequestDto("erin@test.local", "senha123", "João_99", "BR")).isEmpty());
    }

    @ParameterizedTest
    @ValueSource(strings = { "not-an-email", "erin@", "@test.local" })
    void rejectsInvalidEmail(String email) {
        assertEquals(Set.of("email"), invalidFields(new UserRequestDto(email, "senha123", "erin", "BR")));
    }

    @ParameterizedTest
    @ValueSource(strings = { "1234567", "short" })
    void rejectsShortPassword(String password) {
        assertEquals(Set.of("password"), invalidFields(new UserRequestDto("erin@test.local", password, "erin", "BR")));
    }

    @ParameterizedTest
    @ValueSource(strings = { "ab", "this_username_is_too_long", "with space", "bad!char", "<script>" })
    void rejectsInvalidUsername(String username) {
        assertEquals(Set.of("username"),
                invalidFields(new UserRequestDto("erin@test.local", "senha123", username, "BR")));
    }
}

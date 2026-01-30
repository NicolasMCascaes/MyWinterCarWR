package com.mwc.wr.user.infrastructure.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mwc.wr.user.domain.service.PasswordEncryptor;

@Component
public class SpringPasswordEncoder implements PasswordEncryptor {

    private final PasswordEncoder passwordEncoder;

    public SpringPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    @Override
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
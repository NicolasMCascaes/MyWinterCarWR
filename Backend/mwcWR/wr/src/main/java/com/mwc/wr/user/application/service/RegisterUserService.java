package com.mwc.wr.user.application.service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.mwc.wr.shared.exception.InvalidCountryException;
import com.mwc.wr.shared.exception.UserAlreadyExistsException;
import com.mwc.wr.user.application.dto.UserRequestDto;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;
import com.mwc.wr.user.domain.service.PasswordEncryptor;

@Service
public class RegisterUserService {
    private static final Set<String> ISO_COUNTRIES = Set.of(Locale.getISOCountries());

    private final UserRepository userRepository;
    private final PasswordEncryptor passwordEncoder;

    public RegisterUserService(UserRepository userRepository, PasswordEncryptor passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void execute(UserRequestDto dto) {
        String country = dto.country().trim().toUpperCase(Locale.ROOT);
        if (!ISO_COUNTRIES.contains(country)) {
            throw new InvalidCountryException("INVALID_COUNTRY");
        }
        if (userRepository.existsByEmail(dto.email()) || userRepository.existsByUsername(dto.username())) {
            throw new UserAlreadyExistsException("USER_ALREADY_EXISTS");
        }
        User user = new User(null, dto.email(), dto.username(), passwordEncoder.encode(dto.password()), Roles.USER,
                LocalDateTime.now(), country);
        userRepository.save(user);
    }
}

package com.mwc.wr.user.application.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mwc.wr.shared.exception.UserAlreadyExistsException;
import com.mwc.wr.user.application.dto.UserRequestDto;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;

@Service
public class RegisterUserService {
    private final UserRepository userRepository;

    public RegisterUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void execute(UserRequestDto dto) {
        if (userRepository.existsByEmail(dto.email()) || userRepository.existsByUsername(dto.username())) {
            throw new UserAlreadyExistsException("USER_ALREADY_EXISTS");
        }
        User user = new User(null, dto.email(), dto.username(), dto.password(), Roles.USER,
                LocalDateTime.now());
        userRepository.save(user);
    }
}

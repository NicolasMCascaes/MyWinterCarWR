package com.mwc.wr.user.application.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.mwc.wr.shared.exception.ResourceNotFoundException;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;

@Service
public class UpdateUserRoleService {
    private final UserRepository userRepository;

    public UpdateUserRoleService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void execute(UUID userId, Roles role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND"));
        user.setRole(role);
        userRepository.save(user);
    }
}

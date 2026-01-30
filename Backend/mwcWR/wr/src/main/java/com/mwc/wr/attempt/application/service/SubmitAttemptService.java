package com.mwc.wr.attempt.application.service;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptRequestDto;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.shared.exception.ResourceNotFoundException;
import com.mwc.wr.user.domain.repository.UserRepository;

@Service
public class SubmitAttemptService {
    private final AttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public SubmitAttemptService(AttemptRepository attemptRepository, UserRepository userRepository) {
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
    }

    public void submitAttempt(AttemptRequestDto dto) {
        userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.userId()));
        Attempt attempt = new Attempt(null, dto.userId(), dto.videoLink(), dto.attemptTime(), dto.attempt_description(),
                dto.attemptCategory(), dto.attemptStatus(), false);
        attemptRepository.save(attempt);
    }

}

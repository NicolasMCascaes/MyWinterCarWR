package com.mwc.wr.attempt.application.service;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.shared.exception.ResourceNotFoundException;

@Service
public class RewiewAttemptService {
    private final AttemptRepository attemptRepository;

    public RewiewAttemptService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public void acceptAttempt(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        attemptRepository.acceptAttemptById(attemptId);
    }

    public void rejectAttempt(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        attemptRepository.rejectAttemptById(attemptId);
    }
}

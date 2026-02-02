package com.mwc.wr.attempt.application.service;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.application.service.RegisterRecordService;
import com.mwc.wr.shared.exception.ResourceNotFoundException;

@Service
public class RewiewAttemptService {
    private final AttemptRepository attemptRepository;
    private final RegisterRecordService registerRecordService;

    public RewiewAttemptService(AttemptRepository attemptRepository, RegisterRecordService registerRecordService) {
        this.attemptRepository = attemptRepository;
        this.registerRecordService = registerRecordService;
    }

    public void acceptAttempt(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        registerRecordService.execute(attempt.getIdAttempt());
        attemptRepository.acceptAttemptById(attemptId);
    }

    public void rejectAttempt(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        attemptRepository.rejectAttemptById(attemptId);
    }
}

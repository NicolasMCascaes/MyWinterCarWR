package com.mwc.wr.attempt.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.application.service.RegisterRecordService;
import com.mwc.wr.shared.exception.ResourceNotFoundException;

@Service
public class ReviewAttemptService {
    private final AttemptRepository attemptRepository;
    private final RegisterRecordService registerRecordService;

    public ReviewAttemptService(AttemptRepository attemptRepository, RegisterRecordService registerRecordService) {
        this.attemptRepository = attemptRepository;
        this.registerRecordService = registerRecordService;
    }

    @Transactional
    public void acceptAttempt(Long attemptId) {
        Attempt attempt = findLocked(attemptId);
        attempt.approve();
        attemptRepository.save(attempt);
        registerRecordService.recalculatePodium(attempt.getAttemptCategory());
    }

    @Transactional
    public void rejectAttempt(Long attemptId) {
        Attempt attempt = findLocked(attemptId);
        attempt.reject();
        attemptRepository.save(attempt);
    }

    private Attempt findLocked(Long attemptId) {
        return attemptRepository.findByIdForUpdate(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("ATTEMPT_NOT_FOUND"));
    }
}

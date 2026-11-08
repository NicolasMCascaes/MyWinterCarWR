package com.mwc.wr.attempt.application.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.application.dto.AttemptResponseDto;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.shared.exception.ResourceNotFoundException;

@Service
public class ListUserAttemptsService {
    private final AttemptRepository attemptRepository;

    public ListUserAttemptsService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public List<AttemptResponseDto> listUserAttempts(UUID userId) {
        return toResponse(attemptRepository.findAllByUserId(userId));
    }

    public List<AttemptResponseDto> listAllAttemptsByCategory(Category category) {
        return toResponse(attemptRepository.findAllByAttemptCategory(category));
    }

    public List<AttemptResponseDto> listAllAttempts() {
        return toResponse(attemptRepository.findAll());
    }

    public List<AttemptDetails> listAllAttemptsByStatus(AttemptStatus status) {
        return attemptRepository.findDetailsByStatus(status);
    }

    public List<AttemptDetails> listReviewHistory(AttemptStatus status) {
        if (status == null) {
            return attemptRepository.findReviewedDetails();
        }
        return attemptRepository.findReviewedDetailsByStatus(status);
    }

    public AttemptDetails getAttemptDetails(Long id) {
        return attemptRepository.findDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ATTEMPT_NOT_FOUND"));
    }

    public List<AttemptDetails> listApprovedNonRecordAttempts(Category category) {
        return attemptRepository.findApprovedNonRecordDetails(category);
    }

    private List<AttemptResponseDto> toResponse(List<Attempt> attempts) {
        return attempts.stream().map(AttemptResponseDto::from).toList();
    }
}

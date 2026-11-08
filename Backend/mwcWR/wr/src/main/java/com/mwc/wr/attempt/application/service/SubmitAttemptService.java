package com.mwc.wr.attempt.application.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptRequestDto;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.attempt.domain.service.VideoLinkPolicy;
import com.mwc.wr.shared.exception.AttemptAlreadyPendingException;
import com.mwc.wr.shared.exception.InvalidVideoLinkException;
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

    public void submitAttempt(UUID userId, AttemptRequestDto dto) {
        if (!VideoLinkPolicy.isAllowed(dto.videoLink())) {
            throw new InvalidVideoLinkException("INVALID_VIDEO_LINK");
        }

        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND"));

        if (attemptRepository.existsByUserIdAndAttemptStatus(userId, AttemptStatus.PENDING)) {
            throw new AttemptAlreadyPendingException("User already has a pending attempt");
        }

        Attempt attempt = new Attempt(null, userId, dto.videoLink().trim(), dto.attemptTime(), dto.attemptDescription(),
                dto.attemptCategory(), AttemptStatus.PENDING, false, LocalDateTime.now());
        attemptRepository.save(attempt);
    }
}

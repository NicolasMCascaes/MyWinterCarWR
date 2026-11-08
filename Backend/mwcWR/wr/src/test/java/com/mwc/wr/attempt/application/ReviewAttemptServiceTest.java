package com.mwc.wr.attempt.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mwc.wr.attempt.application.service.ReviewAttemptService;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.application.service.RegisterRecordService;
import com.mwc.wr.shared.exception.InvalidAttemptStatusException;
import com.mwc.wr.shared.exception.ResourceNotFoundException;

class ReviewAttemptServiceTest {

    @Mock
    private AttemptRepository attemptRepository;

    @Mock
    private RegisterRecordService registerRecordService;

    private ReviewAttemptService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new ReviewAttemptService(attemptRepository, registerRecordService);
    }

    private Attempt attempt(AttemptStatus status) {
        return new Attempt(1L, UUID.randomUUID(), "link", LocalTime.of(0, 10), "desc", Category.RALLY, status, false);
    }

    @Test
    void acceptAttempt_approvesAndRecalculatesPodium() {
        Attempt attempt = attempt(AttemptStatus.PENDING);
        when(attemptRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(attempt));

        service.acceptAttempt(1L);

        assertEquals(AttemptStatus.APPROVED, attempt.getAttemptStatus());
        verify(attemptRepository).save(attempt);
        verify(registerRecordService).recalculatePodium(Category.RALLY);
    }

    @Test
    void acceptAttempt_throws_whenAlreadyApproved() {
        when(attemptRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(attempt(AttemptStatus.APPROVED)));

        assertThrows(InvalidAttemptStatusException.class, () -> service.acceptAttempt(1L));
        verify(attemptRepository, never()).save(any());
        verify(registerRecordService, never()).recalculatePodium(any());
    }

    @Test
    void rejectAttempt_rejectsWithoutTouchingPodium() {
        Attempt attempt = attempt(AttemptStatus.PENDING);
        when(attemptRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(attempt));

        service.rejectAttempt(1L);

        assertEquals(AttemptStatus.REJECTED, attempt.getAttemptStatus());
        verify(attemptRepository).save(attempt);
        verify(registerRecordService, never()).recalculatePodium(any());
    }

    @Test
    void rejectAttempt_throws_whenAlreadyRejected() {
        when(attemptRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(attempt(AttemptStatus.REJECTED)));

        assertThrows(InvalidAttemptStatusException.class, () -> service.rejectAttempt(1L));
    }

    @Test
    void acceptAttempt_throws_whenNotFound() {
        when(attemptRepository.findByIdForUpdate(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.acceptAttempt(1L));
    }
}

package com.mwc.wr.attempt.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mwc.wr.attempt.application.dto.AttemptRequestDto;
import com.mwc.wr.attempt.application.service.SubmitAttemptService;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.shared.exception.AttemptAlreadyPendingException;
import com.mwc.wr.shared.exception.InvalidVideoLinkException;
import com.mwc.wr.shared.exception.ResourceNotFoundException;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;

public class SubmitAttemptServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AttemptRepository attemptRepository;

    private SubmitAttemptService submitService;

    private final UUID userId = UUID.randomUUID();
    private final AttemptRequestDto dto = new AttemptRequestDto("https://www.youtube.com/watch?v=abc", LocalTime.of(0, 12, 34),
            "description", Category.RALLY);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        submitService = new SubmitAttemptService(attemptRepository, userRepository);
    }

    @Test
    public void submitAttempt_savesPendingAttemptForAuthenticatedUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));

        submitService.submitAttempt(userId, dto);

        ArgumentCaptor<Attempt> captor = ArgumentCaptor.forClass(Attempt.class);
        verify(attemptRepository).save(captor.capture());
        Attempt saved = captor.getValue();
        assertEquals(userId, saved.getUserId());
        assertEquals(AttemptStatus.PENDING, saved.getAttemptStatus());
        assertEquals(false, saved.getIsRecord());
        assertNotNull(saved.getSubmittedAt());
    }

    @Test
    public void submitAttempt_throws_whenUserAlreadyHasPendingAttempt() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));
        when(attemptRepository.existsByUserIdAndAttemptStatus(userId, AttemptStatus.PENDING)).thenReturn(true);

        assertThrows(AttemptAlreadyPendingException.class, () -> submitService.submitAttempt(userId, dto));
        verify(attemptRepository, never()).save(any());
    }

    @Test
    public void submitAttempt_throws_whenUserNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> submitService.submitAttempt(userId, dto));
        verify(attemptRepository, never()).save(any());
    }

    @Test
    public void submitAttempt_throws_whenVideoLinkIsNotAllowed() {
        AttemptRequestDto invalid = new AttemptRequestDto("https://example.com/video.mp4", LocalTime.of(0, 12),
                null, Category.RALLY);

        assertThrows(InvalidVideoLinkException.class, () -> submitService.submitAttempt(userId, invalid));
        verify(attemptRepository, never()).save(any());
    }
}

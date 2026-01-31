package com.mwc.wr.attempt.application;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mwc.wr.attempt.application.dto.AttemptRequestDto;
import com.mwc.wr.attempt.application.service.SubmitAttemptService;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;

public class SubmitAttemptServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private AttemptRepository attemptRepository;

    private SubmitAttemptService submitService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        submitService = new SubmitAttemptService(attemptRepository, userRepository);
    }

    @Test
    public void submitAttempt_whenDataIsValid() {
        UUID userId = UUID.randomUUID();
        String videoLink = "video link";
        LocalTime attemptTime = LocalTime.now();
        String attempt_description = "description";
        Category attemptCategory = Category.RALLY;
        AttemptStatus status = AttemptStatus.APPROVED;
        AttemptRequestDto dto = new AttemptRequestDto(userId, videoLink, attemptTime, attempt_description,
                attemptCategory, status);

        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));
        submitService.submitAttempt(dto);

        verify(userRepository, Mockito.times(1)).findById(userId);
        verify(attemptRepository).save(any(Attempt.class));

    }
}

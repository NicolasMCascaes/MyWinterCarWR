package com.mwc.wr.record.application.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.Category;

public record LeaderboardEntryDto(int position, Long idAttempt, UUID userId, String username, String country,
        Category category, LocalTime attemptTime, String videoLink, String attemptDescription,
        LocalDateTime submittedAt) {

    public static LeaderboardEntryDto from(int position, AttemptDetails attempt) {
        return new LeaderboardEntryDto(position, attempt.getIdAttempt(), attempt.getUserId(), attempt.getUsername(),
                attempt.getCountry(), attempt.getAttemptCategory(), attempt.getAttemptTime(), attempt.getVideoLink(),
                attempt.getAttemptDescription(), attempt.getSubmittedAt());
    }
}

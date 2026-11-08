package com.mwc.wr.attempt.application.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

public interface AttemptDetails {
    Long getIdAttempt();

    LocalTime getAttemptTime();

    String getVideoLink();

    Category getAttemptCategory();

    String getAttemptDescription();

    AttemptStatus getAttemptStatus();

    Boolean getIsRecord();

    LocalDateTime getSubmittedAt();

    UUID getUserId();

    String getUsername();

    String getCountry();

    String getReviewedBy();

    LocalDateTime getReviewedAt();
}

package com.mwc.wr.attempt.application.dto;

import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.Category;

public interface AttemptDetails {
    Long getIdAttempt();

    LocalTime getAttemptTime();

    String getVideoLink();

    Category getAttemptCategory();

    String getAttemptDescription();

    Boolean getIsRecord();

    UUID getUserId();

    String getUsername();
}

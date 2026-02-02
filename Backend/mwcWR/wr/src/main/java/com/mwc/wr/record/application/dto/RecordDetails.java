package com.mwc.wr.record.application.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.domain.model.Position;

public interface RecordDetails {
    public interface RecordDetailsProjection {
        Long getIdRecord();

        String getUsername();

        Category getAttemptCategory();

        LocalTime getAttemptTime();

        String getVideoLink();

        String getAttemptDescription();

        Position getPosition();

        boolean getIsActive();

        LocalDateTime getCreatedAt();
    }
}

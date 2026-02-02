package com.mwc.wr.record.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Record {
    private Long idRecord;
    private UUID userId;
    private Long attemptId;
    private Position position;
    private boolean isActive;
    private LocalDateTime createdAt;

    public Record(Long idRecord, UUID userId, Long attemptId, Position position, boolean isActive,
            LocalDateTime createdAt) {
        this.idRecord = idRecord;
        this.userId = userId;
        this.attemptId = attemptId;
        this.position = position;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public Long getIdRecord() {
        return idRecord;
    }

    public void setIdRecord(Long idRecord) {
        this.idRecord = idRecord;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}

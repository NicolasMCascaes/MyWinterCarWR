package com.mwc.wr.attempt.domain.model;

import java.time.LocalTime;
import java.util.UUID;

import com.mwc.wr.shared.exception.InvalidAttemptStatusException;

public class Attempt {
    private Long idAttempt;
    private UUID userId;
    private String videoLink;
    private LocalTime attemptTime;
    private String attemptDescription;
    private Category attemptCategory;
    private AttemptStatus attemptStatus;
    private Boolean isRecord;

    public Attempt(Long idAttempt, UUID userId, String videoLink, LocalTime attemptTime, String attemptDescription,
            Category attemptCategory, AttemptStatus attemptStatus, Boolean isRecord) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (videoLink == null || videoLink.isBlank()) {
            throw new IllegalArgumentException("Video link cannot be blank");
        }
        if (attemptTime == null) {
            throw new IllegalArgumentException("Attempt time cannot be null");
        }
        if (attemptCategory == null) {
            throw new IllegalArgumentException("Attempt category cannot be null");
        }
        this.idAttempt = idAttempt;
        this.userId = userId;
        this.videoLink = videoLink;
        this.attemptTime = attemptTime;
        this.attemptDescription = attemptDescription;
        this.attemptCategory = attemptCategory;
        this.attemptStatus = attemptStatus;
        this.isRecord = isRecord;
    }

    public Attempt() {
    }

    public void approve() {
        ensurePending();
        this.attemptStatus = AttemptStatus.APPROVED;
    }

    public void reject() {
        ensurePending();
        this.attemptStatus = AttemptStatus.REJECTED;
    }

    private void ensurePending() {
        if (attemptStatus != AttemptStatus.PENDING) {
            throw new InvalidAttemptStatusException("ATTEMPT_NOT_PENDING");
        }
    }

    public Long getIdAttempt() {
        return idAttempt;
    }

    public void setIdAttempt(Long idAttempt) {
        this.idAttempt = idAttempt;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }

    public LocalTime getAttemptTime() {
        return attemptTime;
    }

    public void setAttemptTime(LocalTime attemptTime) {
        this.attemptTime = attemptTime;
    }

    public String getAttemptDescription() {
        return attemptDescription;
    }

    public void setAttemptDescription(String attemptDescription) {
        this.attemptDescription = attemptDescription;
    }

    public Category getAttemptCategory() {
        return attemptCategory;
    }

    public void setAttemptCategory(Category attemptCategory) {
        this.attemptCategory = attemptCategory;
    }

    public AttemptStatus getAttemptStatus() {
        return attemptStatus;
    }

    public void setAttemptStatus(AttemptStatus attemptStatus) {
        this.attemptStatus = attemptStatus;
    }

    public Boolean getIsRecord() {
        return isRecord;
    }

    public void setIsRecord(Boolean isRecord) {
        this.isRecord = isRecord;
    }
}

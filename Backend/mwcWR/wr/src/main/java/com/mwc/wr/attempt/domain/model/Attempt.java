package com.mwc.wr.attempt.domain.model;

import java.time.LocalTime;
import java.util.UUID;

public class Attempt {
    private Long idAttempt;
    private UUID userId;
    private String videoLink;
    private LocalTime attemptTime;
    private String attempt_description;
    private Category attemptCategory;
    private AttemptStatus attemptStatus;
    private Boolean is_record;

    public Attempt(Long idAttempt, UUID userId, String videoLink, LocalTime attemptTime, String attempt_description,
            Category attemptCategory, AttemptStatus attemptStatus, Boolean is_record) {
        this.idAttempt = idAttempt;
        this.userId = userId;
        this.videoLink = videoLink;
        this.attemptTime = attemptTime;
        this.attempt_description = attempt_description;
        this.attemptCategory = attemptCategory;
        this.attemptStatus = attemptStatus;
        this.is_record = is_record;
    }

    public Attempt() {
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

    public Boolean getIs_record() {
        return is_record;
    }

    public void setIs_record(Boolean is_record) {
        this.is_record = is_record;
    }

    public String getAttempt_description() {
        return attempt_description;
    }

    public void setAttempt_description(String attempt_description) {
        this.attempt_description = attempt_description;
    }

}

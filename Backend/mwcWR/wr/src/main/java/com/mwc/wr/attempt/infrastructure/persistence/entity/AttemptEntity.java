package com.mwc.wr.attempt.infrastructure.persistence.entity;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "attempts")
public class AttemptEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAttempt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @Column(name = "video_link", nullable = false)
    private String videoLink;
    @Column(name = "attempt_time", nullable = false)
    private LocalTime attemptTime;
    @Column(name = "attempt_description")
    private String attemptDescription;
    @Column(name = "attempt_category", nullable = false)
    @Enumerated(EnumType.STRING)
    private Category attemptCategory;
    @Column(name = "attempt_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AttemptStatus attemptStatus;
    @Column(name = "is_record")
    private Boolean isRecord;
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private UserEntity reviewer;
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public AttemptEntity(Long idAttempt, UserEntity userId, String videoLink, LocalTime attemptTime,
            String attemptDescription, Category attemptCategory, AttemptStatus attemptStatus, Boolean isRecord,
            LocalDateTime submittedAt) {
        this.idAttempt = idAttempt;
        this.user = userId;
        this.videoLink = videoLink;
        this.attemptTime = attemptTime;
        this.attemptDescription = attemptDescription;
        this.attemptCategory = attemptCategory;
        this.attemptStatus = attemptStatus;
        this.isRecord = isRecord;
        this.submittedAt = submittedAt;
    }

    public AttemptEntity() {

    }

    public AttemptEntity(Long idAttempt) {
        this.idAttempt = idAttempt;
    }

    public Long getIdAttempt() {
        return idAttempt;
    }

    public void setIdAttempt(Long idAttempt) {
        this.idAttempt = idAttempt;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
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

    public Boolean getIsRecord() {
        return isRecord;
    }

    public void setIsRecord(Boolean isRecord) {
        this.isRecord = isRecord;
    }

    public String getAttemptDescription() {
        return attemptDescription;
    }

    public void setAttemptDescription(String attemptDescription) {
        this.attemptDescription = attemptDescription;
    }


    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public UserEntity getReviewer() {
        return reviewer;
    }

    public void setReviewer(UserEntity reviewer) {
        this.reviewer = reviewer;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}

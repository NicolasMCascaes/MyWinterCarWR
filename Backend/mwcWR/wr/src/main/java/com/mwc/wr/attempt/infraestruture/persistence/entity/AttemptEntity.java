package com.mwc.wr.attempt.infraestruture.persistence.entity;

import java.time.LocalTime;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.user.domain.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "attempts")
public class AttemptEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAttempt;
    @Column(name = "user_id", nullable = false)
    @OneToMany(fetch = FetchType.LAZY)
    private User userId;
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

    public AttemptEntity(Long idAttempt, User userId, String videoLink, LocalTime attemptTime,
            String attemptDescription, Category attemptCategory, AttemptStatus attemptStatus, Boolean isRecord) {
        this.idAttempt = idAttempt;
        this.userId = userId;
        this.videoLink = videoLink;
        this.attemptTime = attemptTime;
        this.attemptDescription = attemptDescription;
        this.attemptCategory = attemptCategory;
        this.attemptStatus = attemptStatus;
        this.isRecord = isRecord;
    }

    public Long getIdAttempt() {
        return idAttempt;
    }

    public void setIdAttempt(Long idAttempt) {
        this.idAttempt = idAttempt;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
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

}

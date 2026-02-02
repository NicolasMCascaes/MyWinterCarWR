package com.mwc.wr.record.infraestruture.persistence.entity;

import java.time.LocalDateTime;

import com.mwc.wr.attempt.infraestruture.persistence.entity.AttemptEntity;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "records")
public class RecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idrecord")
    private Long idRecord;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @OneToOne
    @JoinColumn(name = "attempt_id", nullable = false)
    private AttemptEntity attempt;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Position position;
    @Column(name = "is_active", nullable = false)
    private boolean isActive;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public RecordEntity(Long idRecord, UserEntity user, AttemptEntity attempt, Position position, boolean isActive,
            LocalDateTime createdAt) {
        this.idRecord = idRecord;
        this.user = user;
        this.attempt = attempt;
        this.position = position;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public RecordEntity() {
    }

    public Long getIdRecord() {
        return idRecord;
    }

    public void setIdRecord(Long idRecord) {
        this.idRecord = idRecord;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public AttemptEntity getAttempt() {
        return attempt;
    }

    public void setAttempt(AttemptEntity attempt) {
        this.attempt = attempt;
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

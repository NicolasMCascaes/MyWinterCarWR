package com.mwc.wr.attempt.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.infrastructure.persistence.entity.AttemptEntity;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

@Component
public class AttemptMapper {
    public AttemptEntity toEntity(Attempt attempt) {
        AttemptEntity entity = new AttemptEntity(attempt.getIdAttempt(), new UserEntity(attempt.getUserId()),
                attempt.getVideoLink(), attempt.getAttemptTime(), attempt.getAttemptDescription(), attempt.getAttemptCategory(),
                attempt.getAttemptStatus(), attempt.getIsRecord(), attempt.getSubmittedAt());
        entity.setReviewer(attempt.getReviewedBy() == null ? null : new UserEntity(attempt.getReviewedBy()));
        entity.setReviewedAt(attempt.getReviewedAt());
        return entity;
    }

    public Attempt toDomain(AttemptEntity entity) {
        Attempt attempt = new Attempt(entity.getIdAttempt(), entity.getUser().getId(), entity.getVideoLink(),
                entity.getAttemptTime(), entity.getAttemptDescription(), entity.getAttemptCategory(),
                entity.getAttemptStatus(), entity.getIsRecord(), entity.getSubmittedAt());
        attempt.setReviewedBy(entity.getReviewer() == null ? null : entity.getReviewer().getId());
        attempt.setReviewedAt(entity.getReviewedAt());
        return attempt;
    }
}

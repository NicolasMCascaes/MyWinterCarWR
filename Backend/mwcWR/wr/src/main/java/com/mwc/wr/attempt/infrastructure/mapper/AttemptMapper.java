package com.mwc.wr.attempt.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.infrastructure.persistence.entity.AttemptEntity;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

@Component
public class AttemptMapper {
    public AttemptEntity toEntity(Attempt attempt) {
        return new AttemptEntity(attempt.getIdAttempt(), new UserEntity(attempt.getUserId()), attempt.getVideoLink(),
                attempt.getAttemptTime(), attempt.getAttemptDescription(), attempt.getAttemptCategory(),
                attempt.getAttemptStatus(), attempt.getIsRecord());
    }

    public Attempt toDomain(AttemptEntity entity) {
        return new Attempt(entity.getIdAttempt(), entity.getUser().getId(), entity.getVideoLink(),
                entity.getAttemptTime(), entity.getAttemptDescription(), entity.getAttemptCategory(),
                entity.getAttemptStatus(), entity.getIsRecord());
    }
}

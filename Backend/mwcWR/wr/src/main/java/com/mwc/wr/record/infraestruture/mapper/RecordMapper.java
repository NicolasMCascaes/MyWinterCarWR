package com.mwc.wr.record.infraestruture.mapper;

import org.springframework.stereotype.Component;

import com.mwc.wr.attempt.infraestruture.persistence.entity.AttemptEntity;
import com.mwc.wr.record.domain.model.Record;
import com.mwc.wr.record.infraestruture.persistence.entity.RecordEntity;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

@Component
public class RecordMapper {

    public Record toDomain(RecordEntity entity) {
        return new Record(
                entity.getIdRecord(),
                entity.getUser().getId(),
                entity.getAttempt().getIdAttempt(),
                entity.getPosition(),
                entity.isActive(),
                entity.getCreatedAt());
    }

    public RecordEntity toEntity(Record record) {
        RecordEntity entity = new RecordEntity();
        entity.setIdRecord(record.getIdRecord());
        entity.setUser(new UserEntity(record.getUserId()));
        entity.setAttempt(new AttemptEntity(record.getAttemptId()));
        entity.setPosition(record.getPosition());
        entity.setActive(record.isActive());
        entity.setCreatedAt(record.getCreatedAt());
        return entity;
    }
}
package com.mwc.wr.record.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.record.domain.model.Record;

public interface RecordRepository {
    void save(Record record);

    Optional<Record> findById(Long idRecord);

    void inactivateRecord(Long idRecord);

    void activateRecord(Long idRecord);

    List<RecordDetails> findAllByUserIdAndIsActiveTrue(UUID userId);

    List<Record> findAll();

    List<RecordDetails> findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(
            Category category);

    Optional<Record> findByPositionAndAttempt_Category(Position position, Category category);

    List<RecordDetails> findAllDetails();

    Optional<Record> findByUserIdAndAttempt_Category(UUID userId, Category category);

}
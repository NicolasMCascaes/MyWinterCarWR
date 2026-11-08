package com.mwc.wr.record.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.model.Record;

public interface RecordRepository {
    void save(Record record);

    Optional<Record> findById(Long idRecord);

    void inactivateRecord(Long idRecord);

    void activateRecord(Long idRecord);

    List<RecordDetails> findAllByUserIdAndIsActiveTrue(UUID userId);

    List<Record> findAll();

    List<Record> findActiveByCategory(Category category);

    List<RecordDetails> findActiveDetailsByCategory(Category category);

    List<RecordDetails> findAllDetails();

    void lockCategory(Category category);
}

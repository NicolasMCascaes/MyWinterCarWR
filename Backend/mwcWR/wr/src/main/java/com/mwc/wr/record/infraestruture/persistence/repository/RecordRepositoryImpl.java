package com.mwc.wr.record.infraestruture.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.record.domain.model.Record;
import com.mwc.wr.record.domain.repository.RecordRepository;
import com.mwc.wr.record.infraestruture.mapper.RecordMapper;

@Repository
public class RecordRepositoryImpl implements RecordRepository {

    private final SpringDataRecordRepository springDataRecordRepository;
    private final RecordMapper recordMapper;

    public RecordRepositoryImpl(SpringDataRecordRepository springDataRecordRepository, RecordMapper recordMapper) {
        this.springDataRecordRepository = springDataRecordRepository;
        this.recordMapper = recordMapper;
    }

    @Override
    public void save(Record record) {
        springDataRecordRepository.save(recordMapper.toEntity(record));
    }

    @Override
    public Optional<Record> findById(Long idRecord) {
        return springDataRecordRepository.findById(idRecord).map(recordMapper::toDomain);
    }

    @Override
    public void inactivateRecord(Long idRecord) {
        springDataRecordRepository.inactivateRecord(idRecord);
    }

    @Override
    public void activateRecord(Long idRecord) {
        springDataRecordRepository.activateRecord(idRecord);
    }

    @Override
    public List<RecordDetails> findAllByUserIdAndIsActiveTrue(UUID userId) {
        return springDataRecordRepository.findActiveRecordsByUser(userId);
    }

    @Override
    public List<Record> findAll() {
        return springDataRecordRepository.findAll().stream()
                .map(recordMapper::toDomain)
                .toList();
    }

    @Override
    public List<RecordDetails> findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(
            Category category) {
        return springDataRecordRepository
                .findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(category);
    }

    @Override
    public Optional<Record> findByPositionAndAttempt_Category(Position position, Category category) {
        return springDataRecordRepository.findByPositionAndAttempt_AttemptCategoryAndIsActiveTrue(position, category)
                .map(recordMapper::toDomain);
    }

    @Override
    public List<RecordDetails> findAllDetails() {
        return springDataRecordRepository.findAllDetails();
    }

    @Override
    public Optional<Record> findByUserIdAndAttempt_Category(UUID userId, Category category) {
        return springDataRecordRepository.findByUserIdAndAttempt_AttemptCategory(userId, category)
                .map(recordMapper::toDomain);
    }

}

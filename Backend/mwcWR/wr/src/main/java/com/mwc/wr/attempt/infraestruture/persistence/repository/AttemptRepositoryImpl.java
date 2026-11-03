package com.mwc.wr.attempt.infraestruture.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.attempt.infraestruture.mapper.AttemptMapper;

@Repository
public class AttemptRepositoryImpl implements AttemptRepository {
    private final SpringDataAttemptRepository repository;
    private final AttemptMapper attemptMapper;

    public AttemptRepositoryImpl(SpringDataAttemptRepository repository, AttemptMapper attemptMapper) {
        this.repository = repository;
        this.attemptMapper = attemptMapper;
    }

    @Override
    public void save(Attempt attempt) {
        repository.save(attemptMapper.toEntity(attempt));
    }

    @Override
    public Optional<Attempt> findById(Long id) {
        return repository.findById(id).map(attemptMapper::toDomain);
    }

    @Override
    public List<Attempt> findAllByAttemptCategory(Category category) {
        return repository.findAllByAttemptCategory(category).stream().map(attemptMapper::toDomain).toList();
    }

    @Override
    public List<Attempt> findAllByUserId(UUID userId) {
        return repository.findAllByUserId_Id(userId).stream().map(attemptMapper::toDomain).toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public void acceptAttemptById(Long id) {
        repository.acceptAttemptById(id);
    }

    @Override
    public void rejectAttemptById(Long id) {
        repository.rejectAttemptById(id);
    }

    @Override
    public List<Attempt> findAll() {
        return repository.findAll().stream().map(attemptMapper::toDomain).toList();
    }

    @Override
    public List<Attempt> findAllByAttemptStatus(AttemptStatus status) {
        return repository.findAllByAttemptStatus(status).stream().map(attemptMapper::toDomain).toList();
    }

    @Override
    public List<AttemptDetails> findAllByIsRecordFalseAndAttemptCategoryAndAttemptStatus(Category category,
            AttemptStatus status) {
        return repository.findAllByIsRecordFalseAndAttemptCategoryAndAttemptStatus(category, status);
    }

    @Override
    public boolean existsByUserIdAndAttemptStatus(UUID userId, AttemptStatus status) {
        return repository.existsByUser_IdAndAttemptStatus(userId, status);
    }
}

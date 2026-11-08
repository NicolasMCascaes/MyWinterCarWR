package com.mwc.wr.attempt.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.application.dto.CategoryStatusCount;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.attempt.infrastructure.mapper.AttemptMapper;
import com.mwc.wr.attempt.infrastructure.persistence.entity.AttemptEntity;

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
    public Optional<Attempt> findByIdForUpdate(Long id) {
        return repository.findByIdForUpdate(id).map(attemptMapper::toDomain);
    }

    @Override
    public List<Attempt> findAllByAttemptCategory(Category category) {
        return toDomain(repository.findAllByAttemptCategory(category));
    }

    @Override
    public List<Attempt> findAllByUserId(UUID userId) {
        return toDomain(repository.findAllByUser_Id(userId));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Attempt> findAll() {
        return toDomain(repository.findAll());
    }

    @Override
    public List<Attempt> findAllByAttemptStatus(AttemptStatus status) {
        return toDomain(repository.findAllByAttemptStatus(status));
    }

    @Override
    public List<Attempt> findAllByCategoryAndStatusOrderByTime(Category category, AttemptStatus status) {
        return toDomain(
                repository.findAllByAttemptCategoryAndAttemptStatusOrderByAttemptTimeAscIdAttemptAsc(category, status));
    }

    @Override
    public List<AttemptDetails> findApprovedNonRecordDetails(Category category) {
        return repository.findApprovedNonRecordDetails(category, AttemptStatus.APPROVED);
    }

    @Override
    public List<AttemptDetails> findApprovedDetailsOrderByTime(Category category) {
        return repository.findDetailsByCategoryAndStatusOrderByTime(category, AttemptStatus.APPROVED);
    }

    @Override
    public List<AttemptDetails> findDetailsByStatus(AttemptStatus status) {
        return repository.findDetailsByStatus(status);
    }

    @Override
    public Optional<AttemptDetails> findDetailsById(Long id) {
        return repository.findDetailsById(id);
    }

    @Override
    public List<AttemptDetails> findDetailsByUserId(UUID userId) {
        return repository.findDetailsByUserId(userId);
    }

    @Override
    public List<AttemptDetails> findReviewedDetails() {
        return repository.findReviewedDetails();
    }

    @Override
    public List<AttemptDetails> findReviewedDetailsByStatus(AttemptStatus status) {
        return repository.findReviewedDetailsByStatus(status);
    }

    @Override
    public List<LocalDateTime> findSubmissionDatesSince(LocalDateTime since) {
        return repository.findSubmissionDatesSince(since);
    }

    @Override
    public List<CategoryStatusCount> countByCategoryAndStatus() {
        return repository.countByCategoryAndStatus();
    }

    @Override
    public boolean existsByUserIdAndAttemptStatus(UUID userId, AttemptStatus status) {
        return repository.existsByUser_IdAndAttemptStatus(userId, status);
    }

    private List<Attempt> toDomain(List<AttemptEntity> entities) {
        return entities.stream().map(attemptMapper::toDomain).toList();
    }
}

package com.mwc.wr.attempt.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

public interface AttemptRepository {
    void save(Attempt attempt);

    Optional<Attempt> findById(Long id);

    Optional<Attempt> findByIdForUpdate(Long id);

    List<Attempt> findAllByAttemptCategory(Category category);

    List<Attempt> findAllByUserId(UUID userId);

    void deleteById(Long id);

    List<Attempt> findAll();

    List<Attempt> findAllByAttemptStatus(AttemptStatus status);

    List<Attempt> findAllByCategoryAndStatusOrderByTime(Category category, AttemptStatus status);

    List<AttemptDetails> findApprovedNonRecordDetails(Category category);

    boolean existsByUserIdAndAttemptStatus(UUID userId, AttemptStatus status);
}

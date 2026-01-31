package com.mwc.wr.attempt.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

public interface AttemptRepository {
    void save(Attempt attempt);

    Optional<Attempt> findById(Long id);

    List<Attempt> findAllByAttemptCategory(Category category);

    List<Attempt> findAllByUserId(UUID userId);

    void deleteById(Long id);

    void acceptAttemptById(Long id);

    void rejectAttemptById(Long id);

    List<Attempt> findAll();

    List<Attempt> findAllByAttemptStatus(AttemptStatus status);

}

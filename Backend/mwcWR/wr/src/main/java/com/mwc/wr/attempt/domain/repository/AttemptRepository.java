package com.mwc.wr.attempt.domain.repository;

import java.util.List;
import java.util.UUID;

import com.mwc.wr.attempt.domain.model.Attempt;

public interface AttemptRepository {
    void save(Attempt attempt);

    Attempt findById(Long id);

    List<Attempt> findAllByAttemptCategory();

    List<Attempt> findAllByUserId(UUID userId);

    void deleteById(Long id);

    void acceptAttempt(Long id);

    void rejectAttempt(Long id);

}

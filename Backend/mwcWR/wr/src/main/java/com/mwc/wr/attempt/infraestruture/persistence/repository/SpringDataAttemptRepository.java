package com.mwc.wr.attempt.infraestruture.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mwc.wr.attempt.infraestruture.persistence.entity.AttemptEntity;

public interface SpringDataAttemptRepository extends JpaRepository<AttemptEntity, Long> {
    List<AttemptEntity> findAllByAttemptCategory();

    List<AttemptEntity> findAllByUserId();

    List<AttemptEntity> findAllByAttemptStatus();

    @Query("UPDATE AttemptEntity SET attemptStatus = APPROVED WHERE idAttempt = ?1")
    void acceptAttemptById(Long id);

    @Query("UPDATE AttemptEntity SET attemptStatus = REJECTED WHERE idAttempt = ?1")
    void rejectAttemptById(Long id);
}

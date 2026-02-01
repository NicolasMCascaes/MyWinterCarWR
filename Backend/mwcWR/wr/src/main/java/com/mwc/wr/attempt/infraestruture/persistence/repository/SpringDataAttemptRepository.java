package com.mwc.wr.attempt.infraestruture.persistence.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.infraestruture.persistence.entity.AttemptEntity;

@Repository
public interface SpringDataAttemptRepository extends JpaRepository<AttemptEntity, Long> {
    List<AttemptEntity> findAllByAttemptCategory(Category category);

    List<AttemptEntity> findAllByUserId_Id(UUID id);

    List<AttemptEntity> findAllByAttemptStatus(AttemptStatus status);

    @Query("UPDATE AttemptEntity SET attemptStatus = APPROVED WHERE idAttempt = ?1")
    @Modifying
    @Transactional
    void acceptAttemptById(Long id);

    @Query("UPDATE AttemptEntity SET attemptStatus = REJECTED WHERE idAttempt = ?1")
    @Modifying
    @Transactional
    void rejectAttemptById(Long id);
}

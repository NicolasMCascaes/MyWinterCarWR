package com.mwc.wr.attempt.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.infrastructure.persistence.entity.AttemptEntity;

import jakarta.persistence.LockModeType;

public interface SpringDataAttemptRepository extends JpaRepository<AttemptEntity, Long> {
    List<AttemptEntity> findAllByAttemptCategory(Category category);

    List<AttemptEntity> findAllByUser_Id(UUID id);

    List<AttemptEntity> findAllByAttemptStatus(AttemptStatus status);

    List<AttemptEntity> findAllByAttemptCategoryAndAttemptStatusOrderByAttemptTimeAscIdAttemptAsc(Category category,
            AttemptStatus status);

    boolean existsByUser_IdAndAttemptStatus(UUID userId, AttemptStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM AttemptEntity a WHERE a.idAttempt = ?1")
    Optional<AttemptEntity> findByIdForUpdate(Long id);

    @Query("SELECT a.idAttempt as idAttempt, a.attemptTime as attemptTime, a.videoLink as videoLink, a.attemptCategory as attemptCategory, a.attemptDescription as attemptDescription, a.isRecord as isRecord, a.user.id as userId, u.username as username FROM AttemptEntity a JOIN a.user u WHERE a.isRecord = false AND a.attemptCategory = ?1 AND a.attemptStatus = ?2 ORDER BY a.attemptTime ASC")
    List<AttemptDetails> findApprovedNonRecordDetails(Category category, AttemptStatus status);
}

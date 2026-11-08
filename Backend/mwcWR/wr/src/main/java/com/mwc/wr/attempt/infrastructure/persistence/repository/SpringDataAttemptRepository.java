package com.mwc.wr.attempt.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.application.dto.CategoryStatusCount;
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

    String DETAILS_SELECT = """
            SELECT a.idAttempt AS idAttempt, a.attemptTime AS attemptTime, a.videoLink AS videoLink,
                   a.attemptCategory AS attemptCategory, a.attemptDescription AS attemptDescription,
                   a.attemptStatus AS attemptStatus, a.isRecord AS isRecord, a.submittedAt AS submittedAt,
                   u.id AS userId, u.username AS username, u.country AS country,
                   r.username AS reviewedBy, a.reviewedAt AS reviewedAt
            FROM AttemptEntity a JOIN a.user u LEFT JOIN a.reviewer r
            """;

    @Query(DETAILS_SELECT + " WHERE a.isRecord = false AND a.attemptCategory = ?1 AND a.attemptStatus = ?2 ORDER BY a.attemptTime ASC, a.idAttempt ASC")
    List<AttemptDetails> findApprovedNonRecordDetails(Category category, AttemptStatus status);

    @Query(DETAILS_SELECT + " WHERE a.attemptCategory = ?1 AND a.attemptStatus = ?2 ORDER BY a.attemptTime ASC, a.idAttempt ASC")
    List<AttemptDetails> findDetailsByCategoryAndStatusOrderByTime(Category category, AttemptStatus status);

    @Query(DETAILS_SELECT + " WHERE a.attemptStatus = ?1 ORDER BY a.submittedAt ASC NULLS FIRST, a.idAttempt ASC")
    List<AttemptDetails> findDetailsByStatus(AttemptStatus status);

    @Query(DETAILS_SELECT + " WHERE a.idAttempt = ?1")
    Optional<AttemptDetails> findDetailsById(Long id);

    @Query(DETAILS_SELECT + " WHERE a.reviewedAt IS NOT NULL ORDER BY a.reviewedAt DESC, a.idAttempt DESC")
    List<AttemptDetails> findReviewedDetails();

    @Query(DETAILS_SELECT + " WHERE a.reviewedAt IS NOT NULL AND a.attemptStatus = ?1 ORDER BY a.reviewedAt DESC, a.idAttempt DESC")
    List<AttemptDetails> findReviewedDetailsByStatus(AttemptStatus status);

    @Query("SELECT a.submittedAt FROM AttemptEntity a WHERE a.submittedAt >= ?1")
    List<LocalDateTime> findSubmissionDatesSince(LocalDateTime since);

    @Query("SELECT a.attemptCategory AS category, a.attemptStatus AS status, COUNT(a) AS total FROM AttemptEntity a GROUP BY a.attemptCategory, a.attemptStatus")
    List<CategoryStatusCount> countByCategoryAndStatus();
}

package com.mwc.wr.record.infrastructure.persistence.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.infrastructure.persistence.entity.RecordEntity;

@Repository
public interface SpringDataRecordRepository extends JpaRepository<RecordEntity, Long> {
        @Query("UPDATE RecordEntity r SET r.isActive = false WHERE r.idRecord = ?1")
        @Modifying(clearAutomatically = true, flushAutomatically = true)
        @Transactional
        void inactivateRecord(Long idRecord);

        @Query("UPDATE RecordEntity r SET r.isActive = true WHERE r.idRecord = ?1")
        @Modifying(clearAutomatically = true, flushAutomatically = true)
        @Transactional
        void activateRecord(Long idRecord);

        List<RecordEntity> findAllByAttempt_AttemptCategoryAndIsActiveTrue(Category category);

        @Query(value = "SELECT 1 FROM (SELECT pg_advisory_xact_lock(hashtext(?1))) AS category_lock", nativeQuery = true)
        Integer lockCategory(String category);

        @Query("""
                        SELECT
                                r.idRecord AS idRecord,
                                u.username AS username,
                                a.attemptCategory AS attemptCategory,
                                a.attemptTime AS attemptTime,
                                a.videoLink AS videoLink,
                                a.attemptDescription AS attemptDescription,
                                r.position AS position,
                                r.isActive AS isActive,
                                r.createdAt AS createdAt,
                                r.user.id AS userId
                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        WHERE r.isActive = true AND a.attemptCategory = ?1
                        ORDER BY a.attemptTime ASC, a.idAttempt ASC
                        """)
        List<RecordDetails> findActiveDetailsByCategory(Category category);

        @Query("""
                        SELECT
                                r.idRecord AS idRecord,
                                u.username AS username,
                                a.attemptCategory AS attemptCategory,
                                a.attemptTime AS attemptTime,
                                a.videoLink AS videoLink,
                                a.attemptDescription AS attemptDescription,
                                r.position AS position,
                                r.isActive AS isActive,
                                r.createdAt AS createdAt,
                                r.user.id AS userId
                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        WHERE r.user.id = ?1 AND r.isActive = true
                        """)
        List<RecordDetails> findActiveRecordsByUser(UUID userId);

        @Query("""
                        SELECT
                                r.idRecord AS idRecord,
                                u.username AS username,
                                a.attemptCategory AS attemptCategory,
                                a.attemptTime AS attemptTime,
                                a.videoLink AS videoLink,
                                a.attemptDescription AS attemptDescription,
                                r.position AS position,
                                r.isActive AS isActive,
                                r.createdAt AS createdAt,
                                r.user.id AS userId
                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        """)
        List<RecordDetails> findAllDetails();
}

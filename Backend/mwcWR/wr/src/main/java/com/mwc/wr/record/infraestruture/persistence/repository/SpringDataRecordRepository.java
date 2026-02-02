package com.mwc.wr.record.infraestruture.persistence.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.record.infraestruture.persistence.entity.RecordEntity;

import jakarta.transaction.Transactional;

@Repository
public interface SpringDataRecordRepository extends JpaRepository<RecordEntity, Long> {
        @Query("UPDATE RecordEntity r SET r.isActive = false WHERE r.idRecord = ?1")
        @Modifying
        @Transactional
        void inactivateRecord(Long idRecord);

        @Query("UPDATE RecordEntity r SET r.isActive = true WHERE r.idRecord = ?1")
        @Modifying
        @Transactional
        void activateRecord(Long idRecord);

        List<RecordEntity> findAllByUserIdAndIsActiveTrue(UUID userId);

        List<RecordDetails> findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(
                        Category category);

        @Query("""
                        SELECT
                            r.idRecord,
                            u.username,
                            a.attemptCategory,
                            a.attemptTime,
                            a.videoLink,
                            a.attemptDescription,
                            r.position,
                            r.isActive,
                            r.createdAt

                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        WHERE r.position = ?1 AND r.isActive = true AND a.attemptCategory = ?2
                        """)
        Optional<RecordEntity> findByPositionAndAttempt_AttemptCategoryWhereIsActiveTrue(Position position,
                        Category category);

        @Query("""
                        SELECT
                            r.idRecord,
                            u.username,
                            a.attemptCategory,
                            a.attemptTime,
                            a.videoLink,
                            a.attemptDescription,
                            r.position,
                            r.isActive,
                            r.createdAt

                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        WHERE r.user.id = ?1 AND r.isActive = true AND a.attemptCategory = ?2
                        """)
        List<RecordDetails> findActiveRecordsByUserAndCategory(UUID userId, Category category);

        @Query("""
                        SELECT
                            r.idRecord,
                            u.username,
                            a.attemptCategory,
                            a.attemptTime,
                            a.videoLink,
                            a.attemptDescription,
                            r.position,
                            r.isActive,
                            r.createdAt

                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        WHERE r.user.id = ?1 AND r.isActive = true
                        """)
        List<RecordDetails> findActiveRecordsByUser(UUID userId);

        @Query("""
                        SELECT
                            r.idRecord,
                            u.username,
                            a.attemptCategory,
                            a.attemptTime,
                            a.videoLink,
                            a.attemptDescription,
                            r.position,
                            r.isActive,
                            r.createdAt

                        FROM RecordEntity r
                        JOIN r.attempt a
                        JOIN a.user u
                        """)
        List<RecordDetails> findAllDetails();

        Optional<RecordEntity> findByUserIdAndAttempt_AttemptCategory(UUID userId, Category category);

}

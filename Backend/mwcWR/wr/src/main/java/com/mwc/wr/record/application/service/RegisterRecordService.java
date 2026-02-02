package com.mwc.wr.record.application.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.mwc.wr.record.domain.model.Record;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.record.domain.repository.RecordRepository;
import com.mwc.wr.shared.exception.ResourceNotFoundException;

@Service
@Transactional
public class RegisterRecordService {
        private final RecordRepository recordRepository;
        private final AttemptRepository attemptRepository;

        public RegisterRecordService(RecordRepository recordRepository, AttemptRepository attemptRepository) {
                this.recordRepository = recordRepository;
                this.attemptRepository = attemptRepository;
        }

        public void execute(Long idAttempt) {
                Attempt attempt = attemptRepository.findById(idAttempt)
                                .orElseThrow(() -> new ResourceNotFoundException("ATTEMPT_NOT_FOUND"));

                removeExistingUserRecord(attempt.getUserId(), attempt.getAttemptCategory());

                Optional<Record> recordPosition1 = recordRepository.findByPositionAndAttempt_Category(Position.FIRST,
                                attempt.getAttemptCategory());
                Optional<Record> recordPosition2 = recordRepository.findByPositionAndAttempt_Category(Position.SECOND,
                                attempt.getAttemptCategory());
                Optional<Record> recordPosition3 = recordRepository.findByPositionAndAttempt_Category(Position.THIRD,
                                attempt.getAttemptCategory());

                if (recordPosition1.isPresent()) {
                        Attempt attemptRank1 = attemptRepository.findById(recordPosition1.get().getAttemptId())
                                        .orElse(null);

                        if (attempt.getAttemptTime().isBefore(attemptRank1.getAttemptTime())) {

                                handleBetterThanRank1(attempt, idAttempt, recordPosition1, recordPosition2,
                                                recordPosition3);
                        } else if (recordPosition2.isPresent() &&
                                        attempt.getAttemptTime().isBefore(
                                                        attemptRepository.findById(recordPosition2.get().getAttemptId())
                                                                        .get().getAttemptTime())) {

                                handleBetterThanRank2(attempt, idAttempt, recordPosition2, recordPosition3);
                        } else if (recordPosition3.isEmpty() ||
                                        (recordPosition3.isPresent() &&
                                                        attempt.getAttemptTime().isBefore(
                                                                        attemptRepository
                                                                                        .findById(recordPosition3.get()
                                                                                                        .getAttemptId())
                                                                                        .get().getAttemptTime()))) {

                                handleBetterThanRank3(attempt, idAttempt, recordPosition3);
                        }
                } else {

                        Record record = new Record(null, attempt.getUserId(), idAttempt, Position.FIRST, true,
                                        LocalDateTime.now());
                        recordRepository.save(record);
                        attempt.setIs_record(true);
                        attemptRepository.save(attempt);
                }
        }

        private void removeExistingUserRecord(UUID userId, Category category) {

                Optional<Record> userRecord = recordRepository.findByUserIdAndAttempt_Category(userId, category);
                if (userRecord.isPresent()) {
                        recordRepository.inactivateRecord(userRecord.get().getIdRecord());
                }
        }

        private void handleBetterThanRank1(Attempt attempt, Long idAttempt, Optional<Record> pos1,
                        Optional<Record> pos2, Optional<Record> pos3) {

                if (pos3.isPresent()) {
                        recordRepository.inactivateRecord(pos3.get().getIdRecord());
                }

                if (pos2.isPresent()) {
                        pos2.get().setPosition(Position.THIRD);
                        recordRepository.save(pos2.get());
                }

                pos1.get().setPosition(Position.SECOND);
                recordRepository.save(pos1.get());

                Record newRecord = new Record(null, attempt.getUserId(), idAttempt, Position.FIRST,
                                true, LocalDateTime.now());
                recordRepository.save(newRecord);
                attempt.setIs_record(true);
                attemptRepository.save(attempt);
        }

        private void handleBetterThanRank2(Attempt attempt, Long idAttempt, Optional<Record> pos2,
                        Optional<Record> pos3) {

                if (pos3.isPresent()) {
                        recordRepository.inactivateRecord(pos3.get().getIdRecord());
                }

                pos2.get().setPosition(Position.THIRD);
                recordRepository.save(pos2.get());

                Record newRecord = new Record(null, attempt.getUserId(), idAttempt, Position.SECOND,
                                true, LocalDateTime.now());
                recordRepository.save(newRecord);
                attempt.setIs_record(true);
                attemptRepository.save(attempt);
        }

        private void handleBetterThanRank3(Attempt attempt, Long idAttempt, Optional<Record> pos3) {

                if (pos3.isPresent()) {
                        recordRepository.inactivateRecord(pos3.get().getIdRecord());
                }

                Record newRecord = new Record(null, attempt.getUserId(), idAttempt, Position.THIRD,
                                true, LocalDateTime.now());
                recordRepository.save(newRecord);
                attempt.setIs_record(true);
                attemptRepository.save(attempt);
        }

}

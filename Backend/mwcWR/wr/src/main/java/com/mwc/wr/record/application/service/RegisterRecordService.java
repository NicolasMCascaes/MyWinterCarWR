package com.mwc.wr.record.application.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.record.domain.model.Record;
import com.mwc.wr.record.domain.repository.RecordRepository;

@Service
public class RegisterRecordService {
    private static final Position[] PODIUM = Position.values();

    private final RecordRepository recordRepository;
    private final AttemptRepository attemptRepository;

    public RegisterRecordService(RecordRepository recordRepository, AttemptRepository attemptRepository) {
        this.recordRepository = recordRepository;
        this.attemptRepository = attemptRepository;
    }

    @Transactional
    public void recalculatePodium(Category category) {
        recordRepository.lockCategory(category);

        List<Attempt> approved = attemptRepository.findAllByCategoryAndStatusOrderByTime(category,
                AttemptStatus.APPROVED);
        List<Attempt> podium = bestAttemptPerUser(approved);
        Set<Long> podiumAttemptIds = podium.stream().map(Attempt::getIdAttempt).collect(Collectors.toSet());

        Map<Long, Attempt> approvedById = approved.stream()
                .collect(Collectors.toMap(Attempt::getIdAttempt, Function.identity()));
        Map<Long, Record> activeByAttemptId = recordRepository.findActiveByCategory(category).stream()
                .collect(Collectors.toMap(Record::getAttemptId, Function.identity()));

        for (Record record : activeByAttemptId.values()) {
            if (!podiumAttemptIds.contains(record.getAttemptId())) {
                record.setActive(false);
                recordRepository.save(record);
                Attempt attempt = approvedById.get(record.getAttemptId());
                if (attempt == null) {
                    attempt = attemptRepository.findById(record.getAttemptId()).orElse(null);
                }
                if (attempt != null) {
                    attempt.setIsRecord(false);
                    attemptRepository.save(attempt);
                }
            }
        }

        for (int i = 0; i < podium.size(); i++) {
            Attempt attempt = podium.get(i);
            Position position = PODIUM[i];
            Record existing = activeByAttemptId.get(attempt.getIdAttempt());

            if (existing != null) {
                if (existing.getPosition() != position) {
                    existing.setPosition(position);
                    recordRepository.save(existing);
                }
            } else {
                recordRepository.save(new Record(null, attempt.getUserId(), attempt.getIdAttempt(), position, true,
                        LocalDateTime.now()));
                attempt.setIsRecord(true);
                attemptRepository.save(attempt);
            }
        }
    }

    private List<Attempt> bestAttemptPerUser(List<Attempt> orderedAttempts) {
        List<Attempt> podium = new ArrayList<>(PODIUM.length);
        Set<UUID> users = new HashSet<>();
        for (Attempt attempt : orderedAttempts) {
            if (users.add(attempt.getUserId())) {
                podium.add(attempt);
                if (podium.size() == PODIUM.length) {
                    break;
                }
            }
        }
        return podium;
    }
}

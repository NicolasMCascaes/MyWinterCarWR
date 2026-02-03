package com.mwc.wr.record.application.service;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.repository.RecordRepository;

@Service
public class ListRecordsService {
    private final RecordRepository recordRepository;
    private final AttemptRepository attemptRepository;

    public ListRecordsService(RecordRepository recordRepository, AttemptRepository attemptRepository) {
        this.recordRepository = recordRepository;
        this.attemptRepository = attemptRepository;
    }

    public List<RecordDetails> listTopRecordsByCategory(Category category) {
        return recordRepository.findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(category);
    }

    public List<RecordDetails> listLeaderboardByCategory(Category category) {
        List<RecordDetails> recordsPodium = new LinkedList<>(recordRepository
                .findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(category));

        return recordsPodium;
    }

    public List<Object> listPodiumAndOtherAttempts(Category category) {
        List<Object> result = new LinkedList<>();

        List<RecordDetails> records = recordRepository
                .findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(category);
        result.addAll(records);

        Set<UUID> usersWithRecords = new HashSet<>();
        records.forEach(record -> usersWithRecords.add(record.getUserId()));

        List<AttemptDetails> otherAttempts = attemptRepository
                .findAllByIsRecordFalseAndAttemptCategoryAndAttemptStatus(category, AttemptStatus.APPROVED);

        otherAttempts.stream()
                .filter(attempt -> !usersWithRecords.contains(attempt.getUserId()))
                .forEach(result::add);

        return result;
    }
}

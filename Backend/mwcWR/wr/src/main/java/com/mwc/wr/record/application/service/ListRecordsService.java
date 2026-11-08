package com.mwc.wr.record.application.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
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
        return recordRepository.findActiveDetailsByCategory(category);
    }

    public List<Object> listPodiumAndOtherAttempts(Category category) {
        List<RecordDetails> records = recordRepository.findActiveDetailsByCategory(category);
        Set<UUID> usersWithRecords = records.stream().map(RecordDetails::getUserId).collect(Collectors.toSet());

        List<Object> result = new ArrayList<>(records);
        List<AttemptDetails> otherAttempts = attemptRepository.findApprovedNonRecordDetails(category);
        otherAttempts.stream()
                .filter(attempt -> !usersWithRecords.contains(attempt.getUserId()))
                .forEach(result::add);
        return result;
    }
}

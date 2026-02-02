package com.mwc.wr.record.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.repository.RecordRepository;

@Service
public class ListRecordsService {
    private final RecordRepository recordRepository;

    public ListRecordsService(RecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    public List<RecordDetails> listTopRecordsByCategory(Category category) {
        return recordRepository.findAllByAttempt_AttemptCategoryAndIsActiveTrueOrderByAttempt_AttemptTimeDesc(category);
    }
}

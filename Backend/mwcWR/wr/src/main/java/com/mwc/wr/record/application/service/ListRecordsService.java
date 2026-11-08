package com.mwc.wr.record.application.service;

import java.util.List;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.attempt.domain.service.BestAttemptPerUser;
import com.mwc.wr.record.application.dto.LeaderboardEntryDto;
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

    public List<LeaderboardEntryDto> listLeaderboard(Category category) {
        List<AttemptDetails> ranking = BestAttemptPerUser.select(
                attemptRepository.findApprovedDetailsOrderByTime(category), AttemptDetails::getUserId);
        return IntStream.range(0, ranking.size())
                .mapToObj(i -> LeaderboardEntryDto.from(i + 1, ranking.get(i)))
                .toList();
    }
}

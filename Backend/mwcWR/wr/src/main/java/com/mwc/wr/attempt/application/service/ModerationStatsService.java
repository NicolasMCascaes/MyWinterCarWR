package com.mwc.wr.attempt.application.service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.mwc.wr.attempt.application.dto.CategoryStatusCount;
import com.mwc.wr.attempt.application.dto.CategoryTotalsDto;
import com.mwc.wr.attempt.application.dto.DailySubmissionsDto;
import com.mwc.wr.attempt.application.dto.ModerationStatsDto;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;

@Service
public class ModerationStatsService {
    private final AttemptRepository attemptRepository;
    private final Clock clock;

    public ModerationStatsService(AttemptRepository attemptRepository, Clock clock) {
        this.attemptRepository = attemptRepository;
        this.clock = clock;
    }

    public ModerationStatsDto getStats(int days) {
        List<CategoryTotalsDto> totals = totalsPerCategory();
        long pending = totals.stream().mapToLong(CategoryTotalsDto::pending).sum();
        return new ModerationStatsDto(days, pending, submissionsPerDay(days), totals);
    }

    private List<DailySubmissionsDto> submissionsPerDay(int days) {
        LocalDate firstDay = LocalDate.now(clock).minusDays(days - 1L);
        Map<LocalDate, Long> countByDay = attemptRepository.findSubmissionDatesSince(firstDay.atStartOfDay())
                .stream()
                .collect(Collectors.groupingBy(LocalDateTime::toLocalDate, Collectors.counting()));
        return firstDay.datesUntil(firstDay.plusDays(days))
                .map(day -> new DailySubmissionsDto(day, countByDay.getOrDefault(day, 0L)))
                .toList();
    }

    private List<CategoryTotalsDto> totalsPerCategory() {
        Map<Category, Map<AttemptStatus, Long>> counts = new EnumMap<>(Category.class);
        for (CategoryStatusCount row : attemptRepository.countByCategoryAndStatus()) {
            counts.computeIfAbsent(row.getCategory(), c -> new EnumMap<>(AttemptStatus.class))
                    .put(row.getStatus(), row.getTotal());
        }
        return Arrays.stream(Category.values())
                .map(category -> toTotals(category, counts.getOrDefault(category, Map.of())::get))
                .toList();
    }

    private CategoryTotalsDto toTotals(Category category, Function<AttemptStatus, Long> countOf) {
        long pending = valueOrZero(countOf.apply(AttemptStatus.PENDING));
        long approved = valueOrZero(countOf.apply(AttemptStatus.APPROVED));
        long rejected = valueOrZero(countOf.apply(AttemptStatus.REJECTED));
        return new CategoryTotalsDto(category, pending + approved + rejected, pending, approved, rejected);
    }

    private long valueOrZero(Long value) {
        return value == null ? 0L : value;
    }
}

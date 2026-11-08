package com.mwc.wr.attempt.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mwc.wr.attempt.application.dto.CategoryStatusCount;
import com.mwc.wr.attempt.application.dto.CategoryTotalsDto;
import com.mwc.wr.attempt.application.dto.DailySubmissionsDto;
import com.mwc.wr.attempt.application.dto.ModerationStatsDto;
import com.mwc.wr.attempt.application.service.ModerationStatsService;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;

class ModerationStatsServiceTest {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final LocalDate TODAY = LocalDate.of(2026, 11, 8);

    private AttemptRepository attemptRepository;
    private ModerationStatsService service;

    @BeforeEach
    void setUp() {
        attemptRepository = mock(AttemptRepository.class);
        Clock clock = Clock.fixed(TODAY.atTime(15, 0).atZone(ZONE).toInstant(), ZONE);
        service = new ModerationStatsService(attemptRepository, clock);
    }

    private CategoryStatusCount count(Category category, AttemptStatus status, long total) {
        CategoryStatusCount row = mock(CategoryStatusCount.class);
        when(row.getCategory()).thenReturn(category);
        when(row.getStatus()).thenReturn(status);
        when(row.getTotal()).thenReturn(total);
        return row;
    }

    @Test
    void getStats_fillsEveryDayAndEveryCategory() {
        LocalDate firstDay = TODAY.minusDays(2);
        List<LocalDateTime> submissions = List.of(
                LocalDateTime.of(2026, 11, 6, 10, 0),
                LocalDateTime.of(2026, 11, 8, 9, 0),
                LocalDateTime.of(2026, 11, 8, 23, 59));
        List<CategoryStatusCount> counts = List.of(
                count(Category.RALLY, AttemptStatus.APPROVED, 4),
                count(Category.RALLY, AttemptStatus.PENDING, 2),
                count(Category.ICE_RACE, AttemptStatus.REJECTED, 1));
        when(attemptRepository.findSubmissionDatesSince(firstDay.atStartOfDay())).thenReturn(submissions);
        when(attemptRepository.countByCategoryAndStatus()).thenReturn(counts);

        ModerationStatsDto stats = service.getStats(3);

        assertEquals(List.of(
                new DailySubmissionsDto(LocalDate.of(2026, 11, 6), 1),
                new DailySubmissionsDto(LocalDate.of(2026, 11, 7), 0),
                new DailySubmissionsDto(LocalDate.of(2026, 11, 8), 2)), stats.submissionsPerDay());
        assertEquals(Category.values().length, stats.totalsPerCategory().size());
        assertEquals(new CategoryTotalsDto(Category.RALLY, 6, 2, 4, 0), totalsOf(stats, Category.RALLY));
        assertEquals(new CategoryTotalsDto(Category.ICE_RACE, 1, 0, 0, 1), totalsOf(stats, Category.ICE_RACE));
        assertEquals(new CategoryTotalsDto(Category.DEATH, 0, 0, 0, 0), totalsOf(stats, Category.DEATH));
        assertEquals(2, stats.pendingCount());
        assertEquals(3, stats.days());
    }

    private CategoryTotalsDto totalsOf(ModerationStatsDto stats, Category category) {
        return stats.totalsPerCategory().stream()
                .filter(totals -> totals.category() == category)
                .findFirst()
                .orElseThrow();
    }
}

package com.mwc.wr.attempt.application.dto;

import java.util.List;

public record ModerationStatsDto(int days, long pendingCount, List<DailySubmissionsDto> submissionsPerDay,
        List<CategoryTotalsDto> totalsPerCategory) {
}

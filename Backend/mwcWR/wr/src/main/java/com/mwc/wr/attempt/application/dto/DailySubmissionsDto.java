package com.mwc.wr.attempt.application.dto;

import java.time.LocalDate;

public record DailySubmissionsDto(LocalDate date, long submissions) {
}

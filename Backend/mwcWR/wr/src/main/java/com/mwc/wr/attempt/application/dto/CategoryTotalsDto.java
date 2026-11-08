package com.mwc.wr.attempt.application.dto;

import com.mwc.wr.attempt.domain.model.Category;

public record CategoryTotalsDto(Category category, long total, long pending, long approved, long rejected) {
}

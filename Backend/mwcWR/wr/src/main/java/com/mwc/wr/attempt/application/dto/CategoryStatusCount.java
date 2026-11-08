package com.mwc.wr.attempt.application.dto;

import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;

public interface CategoryStatusCount {
    Category getCategory();

    AttemptStatus getStatus();

    Long getTotal();
}

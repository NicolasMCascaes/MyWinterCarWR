package com.mwc.wr.attempt.domain.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;

public final class BestAttemptPerUser {

    private BestAttemptPerUser() {
    }

    public static <T> List<T> select(List<T> attemptsOrderedByTime, Function<T, UUID> userIdOf, int limit) {
        List<T> best = new ArrayList<>();
        Set<UUID> users = new HashSet<>();
        for (T attempt : attemptsOrderedByTime) {
            if (best.size() == limit) {
                break;
            }
            if (users.add(userIdOf.apply(attempt))) {
                best.add(attempt);
            }
        }
        return best;
    }

    public static <T> List<T> select(List<T> attemptsOrderedByTime, Function<T, UUID> userIdOf) {
        return select(attemptsOrderedByTime, userIdOf, Integer.MAX_VALUE);
    }
}

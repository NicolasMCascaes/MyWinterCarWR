package com.mwc.wr.record.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.application.dto.LeaderboardEntryDto;
import com.mwc.wr.record.domain.repository.RecordRepository;

class ListRecordsServiceTest {

    private AttemptRepository attemptRepository;
    private ListRecordsService service;

    @BeforeEach
    void setUp() {
        attemptRepository = mock(AttemptRepository.class);
        service = new ListRecordsService(mock(RecordRepository.class), attemptRepository);
    }

    private AttemptDetails details(long id, UUID user, String username, int minutes) {
        AttemptDetails details = mock(AttemptDetails.class);
        when(details.getIdAttempt()).thenReturn(id);
        when(details.getUserId()).thenReturn(user);
        when(details.getUsername()).thenReturn(username);
        when(details.getCountry()).thenReturn("BR");
        when(details.getAttemptTime()).thenReturn(LocalTime.of(0, minutes));
        return details;
    }

    @Test
    void listLeaderboard_keepsOnlyBestAttemptPerUserWithSequentialPositions() {
        UUID alice = UUID.randomUUID();
        UUID bob = UUID.randomUUID();
        UUID carol = UUID.randomUUID();
        List<AttemptDetails> approvedOrderedByTime = List.of(
                details(1, alice, "alice", 8),
                details(2, bob, "bob", 9),
                details(3, alice, "alice", 10),
                details(4, carol, "carol", 11),
                details(5, bob, "bob", 12));
        when(attemptRepository.findApprovedDetailsOrderByTime(Category.RALLY)).thenReturn(approvedOrderedByTime);

        List<LeaderboardEntryDto> leaderboard = service.listLeaderboard(Category.RALLY);

        assertEquals(3, leaderboard.size());
        assertEquals(List.of(1, 2, 3), leaderboard.stream().map(LeaderboardEntryDto::position).toList());
        assertEquals(List.of(1L, 2L, 4L), leaderboard.stream().map(LeaderboardEntryDto::idAttempt).toList());
        assertEquals("BR", leaderboard.get(0).country());
    }
}

package com.mwc.wr.record.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mwc.wr.attempt.application.dto.AttemptDetails;
import com.mwc.wr.attempt.domain.model.Attempt;
import com.mwc.wr.attempt.domain.model.AttemptStatus;
import com.mwc.wr.attempt.domain.model.Category;
import com.mwc.wr.attempt.domain.repository.AttemptRepository;
import com.mwc.wr.record.application.dto.RecordDetails;
import com.mwc.wr.record.domain.model.Position;
import com.mwc.wr.record.domain.model.Record;
import com.mwc.wr.record.domain.repository.RecordRepository;

class RegisterRecordServiceTest {

    private FakeAttemptRepository attempts;
    private FakeRecordRepository records;
    private RegisterRecordService service;

    private final UUID alice = UUID.randomUUID();
    private final UUID bob = UUID.randomUUID();
    private final UUID carol = UUID.randomUUID();
    private final UUID dave = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        attempts = new FakeAttemptRepository();
        records = new FakeRecordRepository();
        service = new RegisterRecordService(records, attempts);
    }

    private Attempt approve(UUID user, int minutes, int seconds) {
        Attempt a = attempts.add(user, LocalTime.of(0, minutes, seconds));
        service.recalculatePodium(Category.RALLY);
        return a;
    }

    private Map<Position, Long> podium() {
        Map<Position, Long> result = new LinkedHashMap<>();
        records.findActiveByCategory(Category.RALLY).stream()
                .sorted(Comparator.comparing(Record::getPosition))
                .forEach(r -> result.put(r.getPosition(), r.getAttemptId()));
        return result;
    }

    @Test
    void firstApprovedAttempt_becomesFirstPlace() {
        Attempt a = approve(alice, 10, 0);

        assertEquals(Map.of(Position.FIRST, a.getIdAttempt()), podium());
        assertTrue(a.getIsRecord());
    }

    @Test
    void fasterAttempt_pushesOthersDownAndInactivatesFourth() {
        Attempt a = approve(alice, 10, 0);
        Attempt b = approve(bob, 11, 0);
        Attempt c = approve(carol, 12, 0);
        Attempt d = approve(dave, 9, 0);

        Map<Position, Long> p = podium();
        assertEquals(d.getIdAttempt(), p.get(Position.FIRST));
        assertEquals(a.getIdAttempt(), p.get(Position.SECOND));
        assertEquals(b.getIdAttempt(), p.get(Position.THIRD));
        assertFalse(c.getIsRecord());
        assertEquals(1, records.all.stream().filter(r -> !r.isActive()).count());
    }

    @Test
    void slowerAttemptOfSameUser_doesNotChangePodium() {
        Attempt a = approve(alice, 10, 0);
        Attempt b = approve(bob, 11, 0);
        Attempt aSlower = approve(alice, 15, 0);

        Map<Position, Long> p = podium();
        assertEquals(a.getIdAttempt(), p.get(Position.FIRST));
        assertEquals(b.getIdAttempt(), p.get(Position.SECOND));
        assertEquals(2, p.size());
        assertFalse(aSlower.getIsRecord());
    }

    @Test
    void userImprovingTime_replacesOwnRecordWithoutGaps() {
        Attempt a = approve(alice, 10, 0);
        approve(bob, 11, 0);
        Attempt c = approve(carol, 12, 0);
        Attempt cFaster = approve(carol, 9, 0);

        Map<Position, Long> p = podium();
        assertEquals(cFaster.getIdAttempt(), p.get(Position.FIRST));
        assertEquals(a.getIdAttempt(), p.get(Position.SECOND));
        assertEquals(3, p.size());
        assertFalse(c.getIsRecord());
        assertTrue(cFaster.getIsRecord());
    }

    @Test
    void tie_isWonByWhoSubmittedFirst() {
        Attempt a = approve(alice, 10, 0);
        Attempt b = approve(bob, 10, 0);

        Map<Position, Long> p = podium();
        assertEquals(a.getIdAttempt(), p.get(Position.FIRST));
        assertEquals(b.getIdAttempt(), p.get(Position.SECOND));
    }

    @Test
    void recalculatingWithoutChanges_keepsSameRecords() {
        approve(alice, 10, 0);
        approve(bob, 11, 0);
        int recordsBefore = records.all.size();

        service.recalculatePodium(Category.RALLY);

        assertEquals(recordsBefore, records.all.size());
    }


    static class FakeAttemptRepository implements AttemptRepository {
        final Map<Long, Attempt> store = new LinkedHashMap<>();
        long nextId = 1;

        Attempt add(UUID user, LocalTime time) {
            Attempt a = new Attempt(nextId++, user, "link", time, "desc", Category.RALLY, AttemptStatus.APPROVED,
                    false);
            store.put(a.getIdAttempt(), a);
            return a;
        }

        @Override
        public void save(Attempt attempt) {
            store.put(attempt.getIdAttempt(), attempt);
        }

        @Override
        public Optional<Attempt> findById(Long id) {
            return Optional.ofNullable(store.get(id));
        }

        @Override
        public Optional<Attempt> findByIdForUpdate(Long id) {
            return findById(id);
        }

        @Override
        public List<Attempt> findAllByCategoryAndStatusOrderByTime(Category category, AttemptStatus status) {
            return store.values().stream()
                    .filter(a -> a.getAttemptCategory() == category && a.getAttemptStatus() == status)
                    .sorted(Comparator.comparing(Attempt::getAttemptTime).thenComparing(Attempt::getIdAttempt))
                    .toList();
        }

        @Override
        public List<Attempt> findAllByAttemptCategory(Category category) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<Attempt> findAllByUserId(UUID userId) {
            throw new UnsupportedOperationException();
        }

        @Override
        public void deleteById(Long id) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<Attempt> findAll() {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<Attempt> findAllByAttemptStatus(AttemptStatus status) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<AttemptDetails> findApprovedNonRecordDetails(Category category) {
            throw new UnsupportedOperationException();
        }

        @Override
        public boolean existsByUserIdAndAttemptStatus(UUID userId, AttemptStatus status) {
            throw new UnsupportedOperationException();
        }
    }

    static class FakeRecordRepository implements RecordRepository {
        final List<Record> all = new ArrayList<>();
        long nextId = 1;

        @Override
        public void save(Record record) {
            if (record.getIdRecord() == null) {
                record.setIdRecord(nextId++);
                all.add(record);
            }
        }

        @Override
        public List<Record> findActiveByCategory(Category category) {
            return all.stream().filter(Record::isActive).toList();
        }

        @Override
        public void lockCategory(Category category) {
        }

        @Override
        public Optional<Record> findById(Long idRecord) {
            return all.stream().filter(r -> r.getIdRecord().equals(idRecord)).findFirst();
        }

        @Override
        public void inactivateRecord(Long idRecord) {
            findById(idRecord).ifPresent(r -> r.setActive(false));
        }

        @Override
        public void activateRecord(Long idRecord) {
            findById(idRecord).ifPresent(r -> r.setActive(true));
        }

        @Override
        public List<RecordDetails> findAllByUserIdAndIsActiveTrue(UUID userId) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<Record> findAll() {
            return all;
        }

        @Override
        public List<RecordDetails> findActiveDetailsByCategory(Category category) {
            throw new UnsupportedOperationException();
        }

        @Override
        public List<RecordDetails> findAllDetails() {
            throw new UnsupportedOperationException();
        }
    }
}

package com.mwc.wr.user.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.mwc.wr.shared.exception.ResourceNotFoundException;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;

class UpdateUserRoleServiceTest {

    @Mock
    private UserRepository userRepository;

    private UpdateUserRoleService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new UpdateUserRoleService(userRepository);
    }

    @Test
    void execute_promotesUser() {
        UUID id = UUID.randomUUID();
        User user = new User(id, "a@a.com", "a", "hash", Roles.USER, LocalDateTime.now(), "BR");
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        service.execute(id, Roles.MODERATOR);

        assertEquals(Roles.MODERATOR, user.getRole());
        verify(userRepository).save(user);
    }

    @Test
    void execute_throws_whenUserNotFound() {
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.execute(id, Roles.MODERATOR));
        verify(userRepository, never()).save(any());
    }
}

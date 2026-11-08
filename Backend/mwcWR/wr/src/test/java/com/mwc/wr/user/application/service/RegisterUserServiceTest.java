package com.mwc.wr.user.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mwc.wr.shared.exception.UserAlreadyExistsException;
import com.mwc.wr.user.application.dto.UserRequestDto;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;
import com.mwc.wr.user.domain.service.PasswordEncryptor;

class RegisterUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncryptor passwordEncoder;

    private RegisterUserService registerUserService;

    private final String email = "nicolasgmail@gmail.com";
    private final String password = "nicolas123";
    private final String username = "nicolas";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        registerUserService = new RegisterUserService(userRepository, passwordEncoder);
    }

    @Test
    public void execute_shouldSaveUserWithRoleUser_WhenDataIsValid() {
        UserRequestDto dto = new UserRequestDto(email, password, username);
        Mockito.when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        Mockito.when(userRepository.existsByEmail(email)).thenReturn(false);

        registerUserService.execute(dto);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        Mockito.verify(userRepository).save(captor.capture());
        assertEquals(Roles.USER, captor.getValue().getRole());
        assertEquals("encodedPassword", captor.getValue().getPassword());
    }

    @Test
    public void execute_shouldntSaveUser_WhenEmailAlreadyExists() {
        Mockito.when(userRepository.existsByEmail(email)).thenReturn(true);
        UserRequestDto dto = new UserRequestDto(email, password, username);

        assertThrows(UserAlreadyExistsException.class, () -> registerUserService.execute(dto));
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
    }

    @Test
    public void execute_shouldntSaveUser_WhenUsernameAlreadyExists() {
        Mockito.when(userRepository.existsByUsername(username)).thenReturn(true);
        UserRequestDto dto = new UserRequestDto(email, password, username);

        assertThrows(UserAlreadyExistsException.class, () -> registerUserService.execute(dto));
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
    }
}

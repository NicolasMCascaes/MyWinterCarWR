package com.mwc.wr.user.application.service;

import com.mwc.wr.shared.exception.UserAlreadyExistsException;
import com.mwc.wr.user.application.dto.UserRequestDto;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.repository.UserRepository;
import com.mwc.wr.user.domain.service.PasswordEncryptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertThrows;

class RegisterUserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncryptor passwordEncoder;

    private RegisterUserService registerUserService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        registerUserService = new RegisterUserService(userRepository, passwordEncoder);
    }

    @Test
    public void execute_shouldSaveUser_WhenDataIsValid() {
        String email = "nicolasgmail@gmail.com";
        String password = "nicolas123";
        String username = "nicolas";
        Roles roles = Roles.MODERATOR;
        UserRequestDto dto = new UserRequestDto(email, password, username, roles);
        Mockito.when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        Mockito.when(userRepository.existsByEmail(email)).thenReturn(false);
        registerUserService.execute(dto);
        Mockito.verify(userRepository).save(Mockito.any());
        Mockito.verify(passwordEncoder).encode(password);

    }

    @Test
    public void execute_shouldntSaveUser_WhenEmailAlreadyExists() {
        String email = "nicolasgmail@gmail.com";
        String password = "nicolas123";
        String username = "nicolas";
        Roles roles = Roles.MODERATOR;
        Mockito.when(userRepository.existsByEmail(email)).thenReturn(true);
        Mockito.when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        UserRequestDto dto = new UserRequestDto(email, password, username, roles);
        assertThrows(UserAlreadyExistsException.class, () -> registerUserService.execute(dto));
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
    }

    @Test
    public void execute_shouldntSaveUser_WhenUsernameAlreadyExists() {
        String email = "nicolasgmail@gmail.com";
        String password = "nicolas123";
        String username = "nicolas";
        Roles roles = Roles.MODERATOR;
        Mockito.when(userRepository.existsByUsername(username)).thenReturn(true);
        Mockito.when(passwordEncoder.encode(password)).thenReturn("encodedPassword");
        UserRequestDto dto = new UserRequestDto(email, password, username, roles);
        assertThrows(UserAlreadyExistsException.class, () -> registerUserService.execute(dto));
        Mockito.verify(userRepository, Mockito.never()).save(Mockito.any());
    }

}

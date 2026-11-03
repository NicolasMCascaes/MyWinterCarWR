package com.mwc.wr.user.application.service;

import com.mwc.wr.shared.config.jwt.JwtUtil;
import com.mwc.wr.shared.exception.ResourceNotFoundException;
import com.mwc.wr.user.application.dto.UserLoginRequestDto;
import com.mwc.wr.user.application.dto.UserLoginResponseDto;
import com.mwc.wr.user.domain.model.Roles;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;
import com.mwc.wr.user.domain.service.PasswordEncryptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthenticateUserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncryptor passwordEncoder;
    private AuthenticateUserService authenticateUserService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        authenticateUserService = new AuthenticateUserService(userRepository, jwtUtil, passwordEncoder);
    }

    @Test
    void execute_authenticatesUser_whenDataIsValid() {
        String email = "teste@email.com";
        String senha = "123456";
        String senhaCriptografada = "encoded123";
        String username = "testeUser";
        String fakeToken = "fakeToken";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(senhaCriptografada);
        user.setRole(Roles.USER);

        UserLoginRequestDto dto = new UserLoginRequestDto(email, senha);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(senha, senhaCriptografada)).thenReturn(true);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn(fakeToken);

        UserLoginResponseDto response = authenticateUserService.execute(dto);
        assertNotNull(response);
        assertEquals(fakeToken, response.token());
        assertEquals(username, response.username());

        verify(userRepository, times(2)).findByEmail(email);
        verify(passwordEncoder, times(1)).matches(senha, senhaCriptografada);
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void execute_shouldntAuthenticatesUser_whenPasswordIsInvalid() {
        String email = "teste@email.com";
        String senha = "123456";
        String senhaCriptografada = "encoded123";
        String username = "testeUser";
        String fakeToken = "fakeToken";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(senhaCriptografada);
        user.setRole(Roles.USER);

        UserLoginRequestDto dto = new UserLoginRequestDto(email, senha);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(senha, senhaCriptografada)).thenReturn(false);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn(fakeToken);

        assertThrows(BadCredentialsException.class, () -> authenticateUserService.execute(dto));

        verify(userRepository, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).matches(senha, senhaCriptografada);
        verify(jwtUtil, Mockito.never()).generateToken(any(UserDetails.class));
    }

    @Test
    void execute_shouldntAuthenticatesUser_whenUserNotFound() {
        String email = "teste@email.com";
        String senha = "123456";
        String senhaCriptografada = "encoded123";
        String username = "testeUser";
        String fakeToken = "fakeToken";

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(senhaCriptografada);
        user.setRole(Roles.USER);

        UserLoginRequestDto dto = new UserLoginRequestDto(email, senha);

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.matches(senha, senhaCriptografada)).thenReturn(true);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn(fakeToken);

        assertThrows(ResourceNotFoundException.class, () -> authenticateUserService.execute(dto));

        verify(userRepository, times(1)).findByEmail(email);
        verify(passwordEncoder, Mockito.never()).matches(senha, senhaCriptografada);
        verify(jwtUtil, Mockito.never()).generateToken(any(UserDetails.class));
    }
}
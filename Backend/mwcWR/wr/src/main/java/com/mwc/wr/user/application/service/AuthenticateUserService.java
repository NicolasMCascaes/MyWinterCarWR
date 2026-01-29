package com.mwc.wr.user.application.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mwc.wr.shared.config.jwt.CustomUserDetails;
import com.mwc.wr.shared.config.jwt.JwtUtil;
import com.mwc.wr.shared.exception.ResourceNotFoundException;
import com.mwc.wr.user.application.dto.UserLoginRequestDto;
import com.mwc.wr.user.application.dto.UserLoginResponseDto;
import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;
import com.mwc.wr.user.domain.service.PasswordEncryptor;

@Service
public class AuthenticateUserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncryptor passwordEncoder;

    public AuthenticateUserService(UserRepository userRepository, JwtUtil jwtUtil,
            PasswordEncryptor passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public UserLoginResponseDto execute(UserLoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new ResourceNotFoundException("USER_NOT_FOUND"));
        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new BadCredentialsException("WRONG_CREDENTIALS");
        }
        UserDetails userDetails = loadUserByUsername(dto.email());
        return new UserLoginResponseDto(jwtUtil.generateToken(userDetails), user.getUsername());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        return new CustomUserDetails(user.getId(), user.getEmail(), user.getUsername(),
                user.getPassword(), user.getRole());
    }
}

package com.mwc.wr.user.infrastructure.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mwc.wr.user.application.dto.UserLoginRequestDto;
import com.mwc.wr.user.application.dto.UserLoginResponseDto;
import com.mwc.wr.user.application.dto.UserRequestDto;
import com.mwc.wr.user.application.service.AuthenticateUserService;
import com.mwc.wr.user.application.service.RegisterUserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/user")
public class UserController {
    private final RegisterUserService registerUserService;
    private final AuthenticateUserService authenticateUserService;

    public UserController(RegisterUserService registerUserService,
            AuthenticateUserService authenticateUserService) {
        this.registerUserService = registerUserService;
        this.authenticateUserService = authenticateUserService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> userRegister(@RequestBody UserRequestDto dto) {
        registerUserService.execute(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> userLogin(@RequestBody UserLoginRequestDto dto) {
        authenticateUserService.execute(dto);
        return ResponseEntity.ok(authenticateUserService.execute(dto));
    }

}

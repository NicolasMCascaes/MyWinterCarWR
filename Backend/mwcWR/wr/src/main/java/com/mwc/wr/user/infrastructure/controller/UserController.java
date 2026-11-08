package com.mwc.wr.user.infrastructure.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mwc.wr.user.application.dto.UpdateRoleRequestDto;
import com.mwc.wr.user.application.dto.UserLoginRequestDto;
import com.mwc.wr.user.application.dto.UserLoginResponseDto;
import com.mwc.wr.user.application.dto.UserRequestDto;
import com.mwc.wr.user.application.service.AuthenticateUserService;
import com.mwc.wr.user.application.service.RegisterUserService;
import com.mwc.wr.user.application.service.UpdateUserRoleService;

@RestController
@RequestMapping("/user")
public class UserController {
    private final RegisterUserService registerUserService;
    private final AuthenticateUserService authenticateUserService;
    private final UpdateUserRoleService updateUserRoleService;

    public UserController(RegisterUserService registerUserService, AuthenticateUserService authenticateUserService,
            UpdateUserRoleService updateUserRoleService) {
        this.registerUserService = registerUserService;
        this.authenticateUserService = authenticateUserService;
        this.updateUserRoleService = updateUserRoleService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> userRegister(@RequestBody @Validated UserRequestDto dto) {
        registerUserService.execute(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> userLogin(@RequestBody @Validated UserLoginRequestDto dto) {
        return ResponseEntity.ok(authenticateUserService.execute(dto));
    }

    @PatchMapping("/admin/{id}/role")
    public ResponseEntity<Void> updateRole(@PathVariable UUID id, @RequestBody @Validated UpdateRoleRequestDto dto) {
        updateUserRoleService.execute(id, dto.role());
        return ResponseEntity.ok().build();
    }
}

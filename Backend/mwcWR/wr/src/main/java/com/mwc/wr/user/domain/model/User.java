package com.mwc.wr.user.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class User {
    private UUID id;
    private String email;
    private String username;
    private String password;
    private Roles role;
    private LocalDateTime createdAt;

    public User(UUID id, String email, String username, String password, Roles role, LocalDateTime createdAt) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        this.id = id;
        this.role = role;
        this.email = email;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt;
    }

    public User() {

    }

    public void changePassword(String newPassword) {
        if (newPassword.isBlank()) {
            throw new IllegalArgumentException("Password cannot be blank");
        }
        this.password = newPassword;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}

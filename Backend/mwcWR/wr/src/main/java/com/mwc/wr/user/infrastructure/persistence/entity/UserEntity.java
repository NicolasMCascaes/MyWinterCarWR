package com.mwc.wr.user.infrastructure.persistence.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.mwc.wr.user.domain.model.Roles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mwc_users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String username;
    @Column(name = "user_password", nullable = false)
    private String password;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Roles role;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public UserEntity(UUID id, String email, String username, String password, Roles role, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.username = username;
        this.password = password;
        this.createdAt = createdAt;
    }

    public UserEntity() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

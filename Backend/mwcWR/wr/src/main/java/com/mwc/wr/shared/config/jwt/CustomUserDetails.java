package com.mwc.wr.shared.config.jwt;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.mwc.wr.user.domain.model.Roles;

public class CustomUserDetails implements UserDetails {
    private final UUID id;
    private final String email;
    private final String username;
    private final String password;
    private final Roles role;

    public CustomUserDetails(UUID id, String email, String username, String password, Roles role) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Roles getRole() {
        return role;
    }

    public String getUserUsername() {
        return username;
    }

    public String getUserPassword() {
        return password;
    }

}
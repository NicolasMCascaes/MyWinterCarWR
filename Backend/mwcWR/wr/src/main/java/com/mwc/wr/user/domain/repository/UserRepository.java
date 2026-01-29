package com.mwc.wr.user.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.mwc.wr.user.domain.model.User;

public interface UserRepository {
    void save(User user);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findById(UUID id);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}

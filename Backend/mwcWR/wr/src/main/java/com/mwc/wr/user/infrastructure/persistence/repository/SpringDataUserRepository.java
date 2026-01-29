package com.mwc.wr.user.infrastructure.persistence.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

import java.util.Optional;

public interface SpringDataUserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<UserEntity> findByUsername(String username);
}

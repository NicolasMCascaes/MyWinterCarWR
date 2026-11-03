package com.mwc.wr.user.infrastructure.persistence.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.domain.repository.UserRepository;
import com.mwc.wr.user.infrastructure.mapper.UserMapper;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

@Repository
public class JpaUserRepository implements UserRepository {
    private final SpringDataUserRepository jpaRepository;
    private final UserMapper userMapper;

    public JpaUserRepository(SpringDataUserRepository repository, UserMapper userMapper) {
        this.jpaRepository = repository;
        this.userMapper = userMapper;
    }

    @Override
    public void save(User user) {
        UserEntity userEntity = userMapper.toEntity(user);
        jpaRepository.save(userEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepository.findByUsername(username).map(userMapper::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaRepository.findById(id).map(userMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }

}

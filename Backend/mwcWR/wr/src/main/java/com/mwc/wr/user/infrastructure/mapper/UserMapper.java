package com.mwc.wr.user.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.mwc.wr.user.domain.model.User;
import com.mwc.wr.user.infrastructure.persistence.entity.UserEntity;

@Component
public class UserMapper {
    public UserEntity toEntity(User user) {
        return new UserEntity(user.getId(), user.getEmail(), user.getUsername(), user.getPassword(), user.getRole(),
                user.getCreatedAt());
    }

    public User toDomain(UserEntity entity) {
        return new User(entity.getId(), entity.getEmail(), entity.getUsername(), entity.getPassword(),
                entity.getRole(), entity.getCreatedAt());
    }
}

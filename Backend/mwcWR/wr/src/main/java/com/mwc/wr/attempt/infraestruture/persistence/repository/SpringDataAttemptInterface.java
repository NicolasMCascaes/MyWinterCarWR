package com.mwc.wr.attempt.infraestruture.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mwc.wr.attempt.infraestruture.persistence.entity.Attempts;

public interface SpringDataAttemptInterface extends JpaRepository<Attempts, Long> {

}

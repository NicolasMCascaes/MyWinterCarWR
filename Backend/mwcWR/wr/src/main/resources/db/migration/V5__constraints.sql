ALTER TABLE mwc_users ADD CONSTRAINT uk_mwc_users_username UNIQUE (username);

CREATE UNIQUE INDEX IF NOT EXISTS uk_records_active_attempt ON records (attempt_id) WHERE is_active;

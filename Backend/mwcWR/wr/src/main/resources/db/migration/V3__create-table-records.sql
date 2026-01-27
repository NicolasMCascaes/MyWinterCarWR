CREATE TABLE IF NOT EXISTS records(
    idRecord SERIAL PRIMARY KEY,
    user_id UUID REFERENCES mwc_users(id),
    attempt_id INT REFERENCES attempts(id_attempt),
    position INT NOT NULL

)
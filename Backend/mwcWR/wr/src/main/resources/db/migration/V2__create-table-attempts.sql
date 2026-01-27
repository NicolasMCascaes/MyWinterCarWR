CREATE TABLE IF NOT EXISTS attempts(
    id_attempt SERIAL PRIMARY KEY,
    user_id UUID REFERENCES mwc_users(id) NOT NULL,
    video_link TEXT NOT NULL,
    attempt_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    attempt_description varchar(256),
    attempt_status VARCHAR(20) NOT NULL,
    attempt_category VARCHAR(20) NOT NULL,
    is_record BOOLEAN
)
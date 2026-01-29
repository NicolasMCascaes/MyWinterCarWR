CREATE TABLE IF NOT EXISTS mwc_users(
    id UUID PRIMARY KEY,
    email varchar(256) UNIQUE NOT NULL ,
    user_password varchar(256) not null,
    username varchar(256) not null,
    role varchar(50) not null,
    created_at TIMESTAMP NOT NULL,
    UNIQUE(email, username)
)
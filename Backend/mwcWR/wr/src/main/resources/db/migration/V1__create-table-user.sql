CREATE TABLE IF NOT EXISTS mwc_users(
    id UUID PRIMARY KEY,
    email varchar(256) UNIQUE NOT NULL ,
    user_password varchar(256) not null,
    username varchar(256) not null,
    UNIQUE(email, username)
)
DROP TABLE IF EXISTS user_, user_session, user_ver CASCADE;

CREATE TABLE user_ (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    conf BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
);
CREATE TABLE user_session (
    id VARCHAR(255),
    user_id INTEGER,
    PRIMARY KEY(id, user_id),
    FOREIGN KEY(user_id) REFERENCES user_(id)
);
CREATE TABLE user_ver (
    code VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER,
    PRIMARY KEY(code, user_id),
    FOREIGN KEY(user_id) REFERENCES user_(id)
);

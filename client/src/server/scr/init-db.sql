DROP TABLE IF EXISTS user_, user_session CASCADE;

CREATE TABLE user_ (
    id SERIAL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE user_session (
    id VARCHAR(255),
    user_id INTEGER,
    PRIMARY KEY(id, user_id),
    FOREIGN KEY(user_id) REFERENCES user_(id)
)

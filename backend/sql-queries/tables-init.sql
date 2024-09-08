CREATE TABLE IF NOT EXISTS so_users (
  id VARCHAR PRIMARY KEY,
  username VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS so_sessions (
  id SERIAL PRIMARY KEY,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS so_requests (
  id SERIAL PRIMARY KEY,
  request_data JSONB
);

CREATE TABLE IF NOT EXISTS so_user_sessions (
  user_id VARCHAR REFERENCES so_users(id),
  session_id INTEGER REFERENCES so_sessions(id),
  PRIMARY KEY (user_id, session_id)
);

CREATE TABLE IF NOT EXISTS so_session_requests (
  session_id INTEGER REFERENCES so_sessions(id),
  request_id INTEGER REFERENCES so_requests(id),
  PRIMARY KEY (session_id, request_id)
);

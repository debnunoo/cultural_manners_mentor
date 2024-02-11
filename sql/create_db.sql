-- Database: postgres

-- DROP DATABASE IF EXISTS postgres;

-- CREATE DATABASE postgres
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'English_United States.1252'
--     LC_CTYPE = 'English_United States.1252'
--     LOCALE_PROVIDER = 'libc'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;

-- COMMENT ON DATABASE postgres
--     IS 'default administrative connection database';
	

-- creating the users table to store login credentials
-- serial represents auto_increment (usually found in mysql)
CREATE TABLE users (
	user_id serial PRIMARY KEY,
	first_name varchar(30) not null,
	surname varchar(50) not null,
	email varchar(100) not null unique, 
	username varchar(20) not null unique,
	hashedPassword varchar(255) not null
);

-- creating the forum table where posts from the discussion forum 
-- will be stored
CREATE TABLE forum (
	post_id serial primary key, 
	user_id int,
	post_title varchar(100),
	post_content text not null,
	username varchar(20) not null,
	date_added date not null,
	foreign key(user_id) references users(user_id)
);
	
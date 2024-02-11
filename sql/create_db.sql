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
	
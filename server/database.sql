CREATE DATABASE IF NOT EXISTS Capstone;
USE Capstone;

CREATE TABLE users(
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);
/*
INSERT INTO users(user_name,user_email,user_password) 
VALUES ('Tester','Tester@gmail.com','Tester');*/
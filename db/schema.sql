DROP DATABASE IF EXISTS we_boot_db;

CREATE DATABASE we_boot_db;

USE we_boot_db;

CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    github varchar(30) NOT NULL,
    email varchar(80),
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    class_code varchar(30)
);

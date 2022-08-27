DROP DATABASE IF EXISTS we-boot_db;

CREATE DATABASE we-boot_db;

USE we_boot;

CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    github varchar(30) NOT NULL,
    email varchar(30)
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    class varchar(30)
);

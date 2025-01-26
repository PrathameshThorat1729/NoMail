# Create Database
CREATE DATABASE IF NOT EXISTS NoMail;

# Create Table for Users
CREATE TABLE IF NOT EXISTS `users` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `username` varchar(12) NOT NULL,
    `email` varchar(320) NOT NULL,
    `passwordHash` varchar(256) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 40 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

# Create Table for Tokens
CREATE TABLE IF NOT EXISTS `tokens` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `name` varchar(12) NOT NULL,
    `token` varchar(350) NOT NULL,
    `userID` bigint NOT NULL,
    `email` varchar(320) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `userID` (`userID`),
    CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 59 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci
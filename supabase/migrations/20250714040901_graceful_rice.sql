-- Routina Database Schema
-- Run this SQL script in your MySQL database to create the required tables

CREATE DATABASE IF NOT EXISTS routina_db;
USE routina_db;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    streak INT DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    emoji VARCHAR(10) DEFAULT '✨',
    due_date DATE NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE NOT NULL,
    progress INT DEFAULT 0,
    subtasks JSON,
    category VARCHAR(100) NOT NULL,
    motivational_quote TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Work sessions table
CREATE TABLE IF NOT EXISTS work_sessions (
    id VARCHAR(36) PRIMARY KEY,
    project VARCHAR(255) NOT NULL,
    duration INT NOT NULL, -- in minutes
    tags JSON,
    date DATE NOT NULL,
    notes TEXT,
    mood VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reflections table
CREATE TABLE IF NOT EXISTS reflections (
    id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    mood VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User settings table (for storing streak and other user preferences)
CREATE TABLE IF NOT EXISTS user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default streak value
INSERT INTO user_settings (setting_key, setting_value) 
VALUES ('total_streak', '7') 
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- Create indexes for better performance
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_work_sessions_date ON work_sessions(date);
CREATE INDEX idx_reflections_date ON reflections(date);
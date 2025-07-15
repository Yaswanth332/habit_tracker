import * as mysql from 'mysql2/promise';

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

// Default configuration for local MySQL server
const defaultConfig: DatabaseConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // You'll need to set your MySQL password
  database: 'routina_db',
  port: 3306
};

let connection: mysql.Connection | null = null;

export const connectToDatabase = async (config: DatabaseConfig = defaultConfig): Promise<mysql.Connection> => {
  try {
    if (connection) {
      // Test if connection is still alive
      try {
        await connection.ping();
        return connection;
      } catch (error) {
        console.log('Connection lost, reconnecting...');
        connection = null;
      }
    }

    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      ssl: false,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      timeout: 10000,
      reconnect: true
    });
    
    console.log('Successfully connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const getConnection = (): mysql.Connection => {
  if (!connection) {
    throw new Error('Database not connected. Call connectToDatabase first.');
  }
  return connection;
};

export const closeConnection = async (): Promise<void> => {
  if (connection) {
    await connection.end();
    connection = null;
    console.log('Database connection closed');
  }
};

// Test database connection
export const testConnection = async (config: DatabaseConfig): Promise<boolean> => {
  try {
    const testConn = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port || 3306,
      ssl: false,
      connectTimeout: 5000
    });
    
    await testConn.ping();
    await testConn.end();
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Initialize database schema if it doesn't exist
export const initializeSchema = async (config: DatabaseConfig): Promise<void> => {
  try {
    // First connect without specifying database to create it if needed
    const adminConn = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port || 3306,
      ssl: false
    });

    // Create database if it doesn't exist
    await adminConn.execute(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    await adminConn.end();

    // Now connect to the specific database
    const conn = await connectToDatabase(config);

    // Create tables if they don't exist
    await conn.execute(`
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
      )
    `);

    await conn.execute(`
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
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS work_sessions (
        id VARCHAR(36) PRIMARY KEY,
        project VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        tags JSON,
        date DATE NOT NULL,
        notes TEXT,
        mood VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS reflections (
        id VARCHAR(36) PRIMARY KEY,
        date DATE NOT NULL,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        mood VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default streak value
    await conn.execute(`
      INSERT INTO user_settings (setting_key, setting_value) 
      VALUES ('total_streak', '0') 
      ON DUPLICATE KEY UPDATE setting_value = setting_value
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
};
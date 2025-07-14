import mysql from 'mysql2/promise';

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

// Default configuration - you should update these with your actual MySQL credentials
const defaultConfig: DatabaseConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'routina_db',
  port: 3306
};

let connection: mysql.Connection | null = null;

export const connectToDatabase = async (config: DatabaseConfig = defaultConfig): Promise<mysql.Connection> => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port || 3306,
        ssl: false
      });
      console.log('Connected to MySQL database');
    }
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
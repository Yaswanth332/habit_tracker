// Local storage configuration for browser-based data persistence
export interface DatabaseConfig {
  storageKey: string;
}

const defaultConfig: DatabaseConfig = {
  storageKey: 'routina_app_data'
};

// Local storage service for browser-based persistence
export class LocalStorageService {
  private static storageKey = 'routina_app_data';

  static saveData(key: string, data: any): void {
    try {
      const allData = this.getAllData();
      allData[key] = data;
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static getData(key: string): any {
    try {
      const allData = this.getAllData();
      return allData[key] || null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  static getAllData(): any {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to parse localStorage data:', error);
      return {};
    }
  }

  static removeData(key: string): void {
    try {
      const allData = this.getAllData();
      delete allData[key];
      localStorage.setItem(this.storageKey, JSON.stringify(allData));
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Mock functions for compatibility
export const connectToDatabase = async (config?: DatabaseConfig): Promise<boolean> => {
  console.log('Using localStorage for data persistence');
  return true;
};

export const getConnection = () => {
  return { connected: true };
};

export const closeConnection = async (): Promise<void> => {
  console.log('LocalStorage connection closed');
};

export const testConnection = async (config?: DatabaseConfig): Promise<boolean> => {
  return true;
};

export const initializeSchema = async (config?: DatabaseConfig): Promise<void> => {
  console.log('LocalStorage schema initialized');
};
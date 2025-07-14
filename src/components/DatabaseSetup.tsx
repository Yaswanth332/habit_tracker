import React, { useState } from 'react';
import { Database, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

export const DatabaseSetup: React.FC = () => {
  const { initializeDatabase, isLoading, error } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showSetup, setShowSetup] = useState(false);
  const [config, setConfig] = useState({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'routina_db',
    port: 3306
  });
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    try {
      await initializeDatabase(config);
      setIsConnected(true);
      setShowSetup(false);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  if (!showSetup) {
    return (
      <div className={`${themeClasses.card} p-4 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className={themeClasses.accent} size={20} />
            <div>
              <h3 className={`font-medium ${themeClasses.text}`}>Database Connection</h3>
              <p className={`text-sm ${themeClasses.accent}`}>
                {isConnected ? 'Connected to MySQL' : error ? 'Using local storage' : 'Not connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : error ? (
              <AlertCircle className="text-yellow-500" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
            <button
              onClick={() => setShowSetup(true)}
              className={`${themeClasses.button} px-3 py-1 rounded text-sm flex items-center space-x-1`}
            >
              <Settings size={16} />
              <span>Setup</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeClasses.card} p-6 rounded-xl mb-6 border-2 border-dashed ${themeClasses.border}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Database className={themeClasses.accent} size={24} />
        <h3 className={`text-lg font-semibold ${themeClasses.text}`}>MySQL Database Setup</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Create a MySQL database named 'routina_db'</li>
            <li>Run the SQL schema from <code>src/database/schema.sql</code></li>
            <li>Enter your MySQL credentials below</li>
            <li>Click "Connect to Database"</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Host (e.g., localhost)"
            value={config.host}
            onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Port (3306)"
            value={config.port}
            onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 3306 }))}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Username"
            value={config.user}
            onChange={(e) => setConfig(prev => ({ ...prev, user: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={config.password}
            onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Database name"
            value={config.database}
            onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className={`${themeClasses.button} px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Database size={18} />
            <span>{isLoading ? 'Connecting...' : 'Connect to Database'}</span>
          </button>
          <button
            onClick={() => setShowSetup(false)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
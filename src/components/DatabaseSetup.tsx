import React, { useState, useEffect } from 'react';
import { Database, AlertCircle, CheckCircle, Settings, RefreshCw, Play } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { testConnection, initializeSchema } from '../config/database';

export const DatabaseSetup: React.FC = () => {
  const { initializeDatabase, isLoading, error } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showSetup, setShowSetup] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'testing' | 'connected' | 'error'>('disconnected');
  const [config, setConfig] = useState({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'routina_db',
    port: 3306
  });

  // Test connection on component mount
  useEffect(() => {
    const testInitialConnection = async () => {
      try {
        const isValid = await testConnection(config);
        if (isValid) {
          setIsConnected(true);
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.log('Initial connection test failed - this is normal if not configured yet');
      }
    };
    
    testInitialConnection();
  }, []);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    
    try {
      const isValid = await testConnection(config);
      if (isValid) {
        setConnectionStatus('connected');
        setIsConnected(true);
      } else {
        setConnectionStatus('error');
        setIsConnected(false);
      }
    } catch (err) {
      setConnectionStatus('error');
      setIsConnected(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleConnect = async () => {
    try {
      // First test the connection
      const isValid = await testConnection(config);
      if (!isValid) {
        throw new Error('Connection test failed');
      }

      // Initialize schema
      await initializeSchema(config);
      
      // Initialize the application with the database
      await initializeDatabase(config);
      
      setIsConnected(true);
      setConnectionStatus('connected');
      setShowSetup(false);
    } catch (err) {
      console.error('Connection failed:', err);
      setConnectionStatus('error');
      setIsConnected(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'testing':
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to MySQL';
      case 'testing':
        return 'Testing connection...';
      case 'error':
        return 'Connection failed';
      default:
        return 'Not connected';
    }
  };

  if (!showSetup) {
    return (
      <div className={`${themeClasses.card} p-4 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className={themeClasses.accent} size={20} />
            <div>
              <h3 className={`font-medium ${themeClasses.text}`}>Local MySQL Database</h3>
              <p className={`text-sm ${themeClasses.accent}`}>
                {getStatusText()}
                {isConnected && ` (${config.database})`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <button
              onClick={() => setShowSetup(true)}
              className={`${themeClasses.button} px-3 py-1 rounded text-sm flex items-center space-x-1`}
            >
              <Settings size={16} />
              <span>Configure</span>
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
        <h3 className={`text-lg font-semibold ${themeClasses.text}`}>MySQL Local Database Setup</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Quick Setup Guide:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Make sure MySQL is running on your laptop</li>
            <li>Enter your MySQL credentials below</li>
            <li>Click "Test Connection" to verify</li>
            <li>Click "Connect & Initialize" to set up the database</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
            <input
              type="text"
              placeholder="localhost"
              value={config.host}
              onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input
              type="number"
              placeholder="3306"
              value={config.port}
              onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 3306 }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="root"
              value={config.user}
              onChange={(e) => setConfig(prev => ({ ...prev, user: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Your MySQL password"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
            <input
              type="text"
              placeholder="routina_db"
              value={config.database}
              onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-3 rounded-lg border ${
          connectionStatus === 'connected' ? 'bg-green-50 border-green-200' :
          connectionStatus === 'error' ? 'bg-red-50 border-red-200' :
          connectionStatus === 'testing' ? 'bg-blue-50 border-blue-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${
              connectionStatus === 'connected' ? 'text-green-800' :
              connectionStatus === 'error' ? 'text-red-800' :
              connectionStatus === 'testing' ? 'text-blue-800' :
              'text-gray-800'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={isTestingConnection ? 'animate-spin' : ''} />
            <span>Test Connection</span>
          </button>
          
          <button
            onClick={handleConnect}
            disabled={isLoading || !isConnected}
            className={`${themeClasses.button} px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Play size={18} />
            <span>{isLoading ? 'Connecting...' : 'Connect & Initialize'}</span>
          </button>
          
          <button
            onClick={() => setShowSetup(false)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p><strong>Note:</strong> The database and tables will be created automatically if they don't exist.</p>
        </div>
      </div>
    </div>
  );
};
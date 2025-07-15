import React from 'react';
import { Database, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const DatabaseSetup: React.FC = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className={`${themeClasses.card} p-4 rounded-lg mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className={themeClasses.accent} size={20} />
          <div>
            <h3 className={`font-medium ${themeClasses.text}`}>Local Storage</h3>
            <p className={`text-sm ${themeClasses.accent}`}>
              Data stored in your browser
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="text-green-500" size={20} />
          <span className="text-sm text-green-600 font-medium">Connected</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        <p><strong>Note:</strong> Your data is automatically saved to your browser's local storage and will persist between sessions.</p>
      </div>
    </div>
  );
};
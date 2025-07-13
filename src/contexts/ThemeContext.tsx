import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'minimal' | 'forest' | 'neon';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  getThemeClasses: () => {
    bg: string;
    card: string;
    text: string;
    accent: string;
    button: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('minimal');

  const getThemeClasses = () => {
    switch (theme) {
      case 'minimal':
        return {
          bg: 'bg-gray-50',
          card: 'bg-white border border-gray-200',
          text: 'text-gray-900',
          accent: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          border: 'border-gray-200'
        };
      case 'forest':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
          card: 'bg-white/90 backdrop-blur-sm border border-green-200/50',
          text: 'text-green-900',
          accent: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700 text-white',
          border: 'border-green-200'
        };
      case 'neon':
        return {
          bg: 'bg-gradient-to-br from-gray-900 to-blue-900',
          card: 'bg-gray-800/90 backdrop-blur-sm border border-blue-500/30',
          text: 'text-blue-100',
          accent: 'text-cyan-400',
          button: 'bg-cyan-500 hover:bg-cyan-600 text-gray-900',
          border: 'border-blue-500/30'
        };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeClasses }}>
      <div className={`min-h-screen transition-all duration-500 ${getThemeClasses().bg}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
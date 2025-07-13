import React from 'react';
import { Home, CheckSquare, Target, Briefcase, Calendar, BookOpen, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: 'dashboard' | 'tasks' | 'goals' | 'work' | 'calendar' | 'reflection') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const { theme, setTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reflection', label: 'Journal', icon: BookOpen }
  ];

  const themes = [
    { id: 'minimal', label: 'Minimal', emoji: '🖤' },
    { id: 'forest', label: 'Forest', emoji: '🍃' },
    { id: 'neon', label: 'Neon', emoji: '💾' }
  ];

  return (
    <header className={`${themeClasses.card} sticky top-0 z-50 shadow-sm`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${themeClasses.button} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-xl font-bold">R</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${themeClasses.text}`}>Routina</h1>
              <p className={`text-xs ${themeClasses.accent}`}>Your Study Buddy</p>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === item.id
                      ? themeClasses.button
                      : `${themeClasses.text} hover:bg-gray-100 ${theme === 'neon' ? 'hover:bg-gray-700' : ''}`
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
            
            {/* Theme Selector */}
            <div className="relative group">
              <button className={`p-2 rounded-lg ${themeClasses.text} hover:bg-gray-100 ${theme === 'neon' ? 'hover:bg-gray-700' : ''} transition-colors`}>
                <Palette size={18} />
              </button>
              <div className={`absolute right-0 top-12 ${themeClasses.card} rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      theme === t.id ? themeClasses.button : `${themeClasses.text} hover:bg-gray-100 ${theme === 'neon' ? 'hover:bg-gray-700' : ''}`
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
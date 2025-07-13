import React from 'react';
import { Flame, Award, Zap } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

export const StreakDisplay: React.FC = () => {
  const { totalStreak, tasks } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const completedToday = tasks.filter(t => t.type === 'daily' && t.completed).length;
  const totalDaily = tasks.filter(t => t.type === 'daily').length;
  const completionRate = totalDaily > 0 ? (completedToday / totalDaily) * 100 : 0;

  const getAvatarMood = () => {
    if (completionRate >= 80) return '🔥';
    if (completionRate >= 60) return '😊';
    if (completionRate >= 40) return '😐';
    return '😴';
  };

  const getMotivationalMessage = () => {
    if (completionRate >= 80) return "You're crushing it! 🚀";
    if (completionRate >= 60) return "Great progress! Keep going! 💪";
    if (completionRate >= 40) return "You're doing well! 👍";
    return "Let's bounce back! You got this! 💙";
  };

  return (
    <div className={`${themeClasses.card} rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-6xl animate-bounce">
            {getAvatarMood()}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Flame className={`${themeClasses.accent} animate-pulse`} size={24} />
              <span className={`text-2xl font-bold ${themeClasses.text}`}>{totalStreak} Day Streak!</span>
            </div>
            <p className={`${themeClasses.accent} text-lg mb-1`}>
              {completedToday}/{totalDaily} daily tasks completed
            </p>
            <p className={`text-sm ${themeClasses.text} font-medium`}>
              {getMotivationalMessage()}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className={`${themeClasses.card} p-4 rounded-xl text-center min-w-[80px] shadow-sm`}>
            <Award className={`${themeClasses.accent} mx-auto mb-2`} size={24} />
            <div className={`text-2xl font-bold ${themeClasses.text}`}>{completedToday}</div>
            <div className={`text-sm ${themeClasses.accent}`}>Today</div>
          </div>
          <div className={`${themeClasses.card} p-4 rounded-xl text-center min-w-[80px] shadow-sm`}>
            <Zap className={`${themeClasses.accent} mx-auto mb-2`} size={24} />
            <div className={`text-2xl font-bold ${themeClasses.text}`}>{Math.round(completionRate)}%</div>
            <div className={`text-sm ${themeClasses.accent}`}>Rate</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${themeClasses.text}`}>Daily Progress</span>
          <span className={`text-sm ${themeClasses.accent}`}>{Math.round(completionRate)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${themeClasses.button} transition-all duration-500 ease-out`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
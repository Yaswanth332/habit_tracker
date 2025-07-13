import React from 'react';
import { StreakDisplay } from './StreakDisplay';
import { TaskManager } from './TaskManager';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Clock, Target, Briefcase, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { tasks, goals, workSessions } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const todayTasks = tasks.filter(task => task.type === 'daily');
  const completedToday = todayTasks.filter(task => task.completed).length;
  const totalDaily = todayTasks.length;
  
  const todayWork = workSessions
    .filter(session => session.date === new Date().toISOString().split('T')[0])
    .reduce((total, session) => total + session.duration, 0);

  const activeGoals = goals.filter(goal => goal.progress < 100).length;
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  const upcomingTasks = tasks
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Streak Display */}
      <StreakDisplay />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${themeClasses.card} p-4 rounded-xl shadow-sm`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-blue-100 rounded-lg ${themeClasses.accent}`}>
              <Clock size={20} />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeClasses.text}`}>{Math.round(todayWork / 60)}h</div>
              <div className={`text-sm ${themeClasses.accent}`}>Study Time</div>
            </div>
          </div>
        </div>

        <div className={`${themeClasses.card} p-4 rounded-xl shadow-sm`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-green-100 rounded-lg ${themeClasses.accent}`}>
              <Target size={20} />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeClasses.text}`}>{completedToday}/{totalDaily}</div>
              <div className={`text-sm ${themeClasses.accent}`}>Daily Tasks</div>
            </div>
          </div>
        </div>

        <div className={`${themeClasses.card} p-4 rounded-xl shadow-sm`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-purple-100 rounded-lg ${themeClasses.accent}`}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeClasses.text}`}>{activeGoals}</div>
              <div className={`text-sm ${themeClasses.accent}`}>Active Goals</div>
            </div>
          </div>
        </div>

        <div className={`${themeClasses.card} p-4 rounded-xl shadow-sm`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-orange-100 rounded-lg ${themeClasses.accent}`}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className={`text-xl font-bold ${themeClasses.text}`}>{avgGoalProgress}%</div>
              <div className={`text-sm ${themeClasses.accent}`}>Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${themeClasses.card} rounded-xl p-6 shadow-sm`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Today's Focus</h3>
          <div className="space-y-3">
            {todayTasks.slice(0, 4).map(task => (
              <div key={task.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                task.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <span className="text-xl">{task.emoji}</span>
                <div className="flex-1">
                  <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : themeClasses.text}`}>
                    {task.title}
                  </div>
                  <div className={`text-sm ${themeClasses.accent}`}>{task.category}</div>
                </div>
                {task.completed && <span className="text-green-500 text-xl">✓</span>}
              </div>
            ))}
          </div>
        </div>

        <div className={`${themeClasses.card} rounded-xl p-6 shadow-sm`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? upcomingTasks.map(task => {
              const daysLeft = Math.ceil((new Date(task.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{task.emoji}</span>
                    <div>
                      <div className={`font-medium ${themeClasses.text}`}>{task.title}</div>
                      <div className={`text-sm ${themeClasses.accent}`}>{task.category}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium px-2 py-1 rounded ${
                    daysLeft <= 1 ? 'bg-red-100 text-red-700' :
                    daysLeft <= 3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className={`${themeClasses.text}`}>No upcoming deadlines!</p>
                <p className={`text-sm ${themeClasses.accent}`}>You're all caught up</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Task Add */}
      <TaskManager isQuickView={true} />
    </div>
  );
};
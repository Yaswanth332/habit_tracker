import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

export const CalendarView: React.FC = () => {
  const { tasks, workSessions } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDayStats = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = tasks.filter(task => {
      if (task.dueDate === dateStr) return true;
      if (task.completed && task.type === 'daily') return true;
      return false;
    });
    const dayWork = workSessions.filter(session => session.date === dateStr);
    
    return {
      tasksCompleted: dayTasks.filter(t => t.completed).length,
      tasksTotal: dayTasks.length,
      workHours: dayWork.reduce((total, session) => total + session.duration, 0) / 60,
      hasDeadline: dayTasks.some(task => task.dueDate === dateStr && !task.completed),
      workSessions: dayWork,
      tasks: dayTasks
    };
  };

  const getDayEmoji = (stats: any) => {
    if (stats.hasDeadline) return '⚠️';
    if (stats.workHours >= 4 && stats.tasksCompleted >= 3) return '🔥';
    if (stats.workHours >= 2 || stats.tasksCompleted >= 2) return '📘';
    if (stats.workHours > 0 || stats.tasksCompleted > 0) return '✅';
    return '😐';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className={`${themeClasses.accent}`} size={28} />
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Calendar Overview</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className={`p-2 rounded-lg ${themeClasses.text} hover:bg-gray-100 transition-colors`}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className={`text-xl font-semibold ${themeClasses.text} min-w-[200px] text-center`}>
            {monthYear}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className={`p-2 rounded-lg ${themeClasses.text} hover:bg-gray-100 transition-colors`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className={`${themeClasses.card} rounded-xl p-6`}>
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map(day => (
                <div key={day} className={`text-center py-2 text-sm font-semibold ${themeClasses.accent}`}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" />;
                }
                
                const stats = getDayStats(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const dayEmoji = getDayEmoji(stats);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square p-2 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                      isToday 
                        ? `${themeClasses.button} text-white` 
                        : selectedDay?.toDateString() === day.toDateString()
                        ? `${themeClasses.card} ring-2 ring-blue-400`
                        : `${themeClasses.card} hover:bg-gray-50`
                    }`}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div className={`text-sm font-medium ${isToday ? 'text-white' : themeClasses.text}`}>
                        {day.getDate()}
                      </div>
                      <div className="text-center">
                        <div className="text-lg mb-1">{dayEmoji}</div>
                        {(stats.tasksCompleted > 0 || stats.workHours > 0) && (
                          <div className="text-xs space-y-1">
                            {stats.tasksCompleted > 0 && (
                              <div className={`${isToday ? 'text-white' : 'text-green-600'}`}>
                                ✓{stats.tasksCompleted}
                              </div>
                            )}
                            {stats.workHours > 0 && (
                              <div className={`${isToday ? 'text-white' : 'text-blue-600'}`}>
                                {Math.round(stats.workHours)}h
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Details */}
        <div className="space-y-4">
          {selectedDay ? (
            <>
              <div className={`${themeClasses.card} rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>
                  {selectedDay.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {(() => {
                  const stats = getDayStats(selectedDay);
                  return (
                    <div className="space-y-4">
                      {/* Tasks */}
                      {stats.tasks.length > 0 && (
                        <div>
                          <h4 className={`font-medium ${themeClasses.text} mb-2`}>Tasks</h4>
                          <div className="space-y-2">
                            {stats.tasks.map(task => (
                              <div key={task.id} className="flex items-center space-x-2 text-sm">
                                <span className={task.completed ? 'text-green-500' : 'text-gray-400'}>
                                  {task.completed ? '✓' : '○'}
                                </span>
                                <span className={task.completed ? 'line-through text-gray-500' : themeClasses.text}>
                                  {task.emoji} {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Sessions */}
                      {stats.workSessions.length > 0 && (
                        <div>
                          <h4 className={`font-medium ${themeClasses.text} mb-2`}>Work Sessions</h4>
                          <div className="space-y-2">
                            {stats.workSessions.map(session => (
                              <div key={session.id} className="text-sm">
                                <div className="flex items-center space-x-2">
                                  <span>{session.mood}</span>
                                  <span className={themeClasses.text}>{session.project}</span>
                                  <span className={themeClasses.accent}>
                                    ({Math.round(session.duration / 60)}h {session.duration % 60}m)
                                  </span>
                                </div>
                                {session.notes && (
                                  <p className={`text-xs ${themeClasses.accent} ml-6`}>{session.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {stats.tasks.length === 0 && stats.workSessions.length === 0 && (
                        <p className={`text-center ${themeClasses.accent} py-8`}>
                          No activity recorded for this day
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className={`${themeClasses.card} rounded-xl p-6 text-center`}>
              <div className="text-4xl mb-2">📅</div>
              <p className={themeClasses.text}>Click on a day to see details</p>
            </div>
          )}

          {/* Legend */}
          <div className={`${themeClasses.card} rounded-xl p-6`}>
            <h4 className={`font-medium ${themeClasses.text} mb-3`}>Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔥</span>
                <span className={themeClasses.accent}>Productive Day (4+ hours, 3+ tasks)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">📘</span>
                <span className={themeClasses.accent}>Study Day (2+ hours or 2+ tasks)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">✅</span>
                <span className={themeClasses.accent}>Some Activity</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚠️</span>
                <span className={themeClasses.accent}>Has Deadline</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">😐</span>
                <span className={themeClasses.accent}>No Activity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
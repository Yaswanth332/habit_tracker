import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const Calendar: React.FC = () => {
  const { tasks, studySessions } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const getDayData = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = tasks.filter(task => {
      if (task.dueDate === dateStr) return true;
      if (task.completed && task.type === 'daily') return true;
      return false;
    });
    const dayStudy = studySessions.filter(session => session.date === dateStr);
    
    return {
      tasks: dayTasks,
      studyTime: dayStudy.reduce((total, session) => total + session.duration, 0),
      hasDeadline: dayTasks.some(task => task.dueDate === dateStr),
      hasActivity: dayTasks.length > 0 || dayStudy.length > 0
    };
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {monthYear}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="aspect-square border-r border-b border-gray-100" />;
            }
            
            const dayData = getDayData(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square border-r border-b border-gray-100 p-2 hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-blue-50' : ''
                }`}
              >
                <div className="h-full flex flex-col">
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    {dayData.hasDeadline && (
                      <div className="w-full h-1 bg-red-400 rounded-full" />
                    )}
                    {dayData.studyTime > 0 && (
                      <div className="text-xs text-blue-600 font-medium">
                        {Math.round(dayData.studyTime / 60)}h study
                      </div>
                    )}
                    {dayData.tasks.filter(t => t.completed).length > 0 && (
                      <div className="text-xs text-green-600">
                        ✓ {dayData.tasks.filter(t => t.completed).length} tasks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-red-400 rounded-full" />
            <span className="text-gray-600">Assignment Due</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 font-medium">2h study</span>
            <span className="text-gray-600">Study Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✓ 3 tasks</span>
            <span className="text-gray-600">Completed Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Clock, Tag, Calendar, Play, Pause, Square } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

export const WorkTracker: React.FC = () => {
  const { workSessions, addWorkSession } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentSession, setCurrentSession] = useState({
    project: '',
    tags: '',
    notes: '',
    mood: '🧠',
    startTime: null as Date | null
  });

  const moodOptions = ['🧠', '🚀', '💪', '😊', '😴', '🔥', '⚡', '🎯'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    if (currentSession.project.trim()) {
      setCurrentSession(prev => ({ ...prev, startTime: new Date() }));
      setIsTimerRunning(true);
      setTimerSeconds(0);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleStopTimer = () => {
    if (currentSession.startTime) {
      const duration = Math.round(timerSeconds / 60);
      addWorkSession({
        project: currentSession.project,
        duration,
        tags: currentSession.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        date: new Date().toISOString().split('T')[0],
        notes: currentSession.notes,
        mood: currentSession.mood
      });
      setCurrentSession({ project: '', tags: '', notes: '', mood: '🧠', startTime: null });
      setIsTimerRunning(false);
      setTimerSeconds(0);
      setShowAddForm(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTotalHoursToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return workSessions
      .filter(session => session.date === today)
      .reduce((total, session) => total + session.duration, 0);
  };

  const getTotalHoursWeek = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workSessions
      .filter(session => new Date(session.date) >= weekAgo)
      .reduce((total, session) => total + session.duration, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className={`${themeClasses.accent}`} size={28} />
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Work Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`${themeClasses.card} px-4 py-2 rounded-lg`}>
            <span className={`text-sm ${themeClasses.accent}`}>Today: </span>
            <span className={`font-bold ${themeClasses.text}`}>{formatDuration(getTotalHoursToday())}</span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${themeClasses.button} px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105`}
          >
            <Plus size={18} />
            <span>Track Work</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${themeClasses.card} p-6 rounded-xl`}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>{formatDuration(getTotalHoursToday())}</div>
              <div className={`text-sm ${themeClasses.accent}`}>Today</div>
            </div>
          </div>
        </div>

        <div className={`${themeClasses.card} p-6 rounded-xl`}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>{formatDuration(getTotalHoursWeek())}</div>
              <div className={`text-sm ${themeClasses.accent}`}>This Week</div>
            </div>
          </div>
        </div>

        <div className={`${themeClasses.card} p-6 rounded-xl`}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>{workSessions.length}</div>
              <div className={`text-sm ${themeClasses.accent}`}>Total Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer/Add Session Form */}
      {showAddForm && (
        <div className={`${themeClasses.card} p-6 rounded-xl border-2 border-dashed ${themeClasses.border}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Track Work Session</h3>
          
          {/* Timer Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
            <div className={`text-4xl font-mono font-bold ${themeClasses.text} mb-2`}>
              {formatTime(timerSeconds)}
            </div>
            <div className="flex justify-center space-x-3">
              {!isTimerRunning ? (
                <button
                  onClick={handleStartTimer}
                  disabled={!currentSession.project.trim()}
                  className={`${themeClasses.button} px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Play size={18} />
                  <span>Start</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePauseTimer}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                  >
                    <Pause size={18} />
                    <span>Pause</span>
                  </button>
                  <button
                    onClick={handleStopTimer}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105"
                  >
                    <Square size={18} />
                    <span>Stop & Save</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project name (e.g., DSA Practice, React Portfolio)..."
                value={currentSession.project}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, project: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Tags (e.g., coding, leetcode, frontend)..."
                value={currentSession.tags}
                onChange={(e) => setCurrentSession(prev => ({ ...prev, tags: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <textarea
              placeholder="Session notes (what did you work on?)..."
              value={currentSession.notes}
              onChange={(e) => setCurrentSession(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>How are you feeling?</label>
              <div className="flex space-x-2">
                {moodOptions.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setCurrentSession(prev => ({ ...prev, mood }))}
                    className={`text-2xl p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      currentSession.mood === mood ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Work Sessions Timeline */}
      <div className={`${themeClasses.card} rounded-xl p-6`}>
        <h3 className={`text-xl font-bold ${themeClasses.text} mb-6`}>Recent Sessions</h3>
        
        {workSessions.length > 0 ? (
          <div className="space-y-4">
            {workSessions.slice().reverse().map(session => (
              <div key={session.id} className={`${themeClasses.card} p-4 rounded-xl border transition-all duration-300 hover:shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{session.mood}</div>
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text}`}>{session.project}</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} className={themeClasses.accent} />
                          <span className={themeClasses.accent}>{formatDuration(session.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} className={themeClasses.accent} />
                          <span className={themeClasses.accent}>{session.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {session.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag size={14} className={themeClasses.accent} />
                    <div className="flex flex-wrap gap-1">
                      {session.tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {session.notes && (
                  <p className={`text-sm ${themeClasses.accent} mt-2`}>{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <p className={`text-lg ${themeClasses.text}`}>No work sessions yet!</p>
            <p className={`${themeClasses.accent}`}>Start tracking your productive time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
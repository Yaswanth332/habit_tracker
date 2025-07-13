import React, { useState } from 'react';
import { Plus, BookOpen, Clock, Play, Square } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const StudyTracker: React.FC = () => {
  const { studySessions, addStudySession } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.topic.trim()) return;

    const duration = isTimerActive && timerStartTime 
      ? Math.round((new Date().getTime() - timerStartTime.getTime()) / (1000 * 60))
      : timerMinutes;

    addStudySession({
      ...formData,
      duration,
      date: new Date().toISOString().split('T')[0]
    });

    setFormData({ subject: '', topic: '', notes: '' });
    setShowAddForm(false);
    setIsTimerActive(false);
    setTimerMinutes(0);
    setTimerStartTime(null);
  };

  const startTimer = () => {
    setIsTimerActive(true);
    setTimerStartTime(new Date());
  };

  const stopTimer = () => {
    if (timerStartTime) {
      const duration = Math.round((new Date().getTime() - timerStartTime.getTime()) / (1000 * 60));
      setTimerMinutes(duration);
    }
    setIsTimerActive(false);
    setTimerStartTime(null);
  };

  const getCurrentTimerMinutes = () => {
    if (!isTimerActive || !timerStartTime) return timerMinutes;
    return Math.round((new Date().getTime() - timerStartTime.getTime()) / (1000 * 60));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTodayTotal = () => {
    const today = new Date().toISOString().split('T')[0];
    return studySessions
      .filter(session => session.date === today)
      .reduce((total, session) => total + session.duration, 0);
  };

  const getWeekTotal = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return studySessions
      .filter(session => new Date(session.date) >= weekAgo)
      .reduce((total, session) => total + session.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Study Tracker</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Log Session</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatDuration(getTodayTotal())}</div>
              <div className="text-sm text-gray-500">Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{formatDuration(getWeekTotal())}</div>
              <div className="text-sm text-gray-500">This Week</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{studySessions.length}</div>
              <div className="text-sm text-gray-500">Total Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Session Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Study Session</h3>
          
          {/* Timer */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatDuration(getCurrentTimerMinutes())}
                </div>
                <div className="text-sm text-gray-500">
                  {isTimerActive ? 'Timer running...' : 'Study time'}
                </div>
              </div>
              <div className="flex space-x-2">
                {!isTimerActive ? (
                  <button
                    onClick={startTimer}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                  >
                    <Play size={16} />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
                  >
                    <Square size={16} />
                    <span>Stop</span>
                  </button>
                )}
                {!isTimerActive && (
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={timerMinutes || ''}
                    onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Subject..."
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Topic..."
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <textarea
              placeholder="Notes (optional)..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Session
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setIsTimerActive(false);
                  setTimerMinutes(0);
                  setTimerStartTime(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
        
        {studySessions.length > 0 ? (
          <div className="space-y-3">
            {studySessions.slice().reverse().slice(0, 10).map(session => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium text-gray-900">{session.subject}</div>
                    <div className="text-sm text-gray-500">•</div>
                    <div className="text-sm text-gray-600">{session.topic}</div>
                  </div>
                  {session.notes && (
                    <div className="text-sm text-gray-500 mt-1">{session.notes}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatDuration(session.duration)}</div>
                  <div className="text-sm text-gray-500">{session.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study sessions yet</h3>
            <p className="text-gray-500">Start tracking your study time!</p>
          </div>
        )}
      </div>
    </div>
  );
};
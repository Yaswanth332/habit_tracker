import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, Quote } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

export const GoalBoard: React.FC = () => {
  const { goals, addGoal, updateGoalProgress } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'Academic',
    subtasks: '',
    motivationalQuote: ''
  });

  const motivationalQuotes = [
    "Code is poetry written in logic! 💻✨",
    "Every expert was once a beginner! 🌱",
    "Debug your code, debug your life! 🐛➡️✨",
    "Compile your dreams into reality! ⚡",
    "Git commit to your goals! 🚀",
    "Stack overflow? More like stack overflow with success! 📚"
  ];

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      addGoal({
        title: newGoal.title,
        description: newGoal.description,
        deadline: newGoal.deadline,
        progress: 0,
        subtasks: newGoal.subtasks.split(',').map(s => s.trim()).filter(Boolean),
        category: newGoal.category,
        motivationalQuote: newGoal.motivationalQuote || motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
      });
      setNewGoal({ title: '', description: '', deadline: '', category: 'Academic', subtasks: '', motivationalQuote: '' });
      setShowAddForm(false);
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-700';
      case 'Career': return 'bg-purple-100 text-purple-700';
      case 'Personal': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className={`${themeClasses.accent}`} size={28} />
          <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Goal Board</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`${themeClasses.button} px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105`}
        >
          <Plus size={18} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className={`${themeClasses.card} p-6 rounded-xl border-2 border-dashed ${themeClasses.border}`}>
          <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Create New Goal</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Goal title (e.g., Complete DSA Course)..."
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Academic">Academic</option>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            
            <textarea
              placeholder="Description..."
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Subtasks (comma separated)..."
                value={newGoal.subtasks}
                onChange={(e) => setNewGoal(prev => ({ ...prev, subtasks: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              placeholder="Custom motivational quote (optional)..."
              value={newGoal.motivationalQuote}
              onChange={(e) => setNewGoal(prev => ({ ...prev, motivationalQuote: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={handleAddGoal}
              className={`${themeClasses.button} px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105`}
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map(goal => {
          const daysLeft = getDaysUntilDeadline(goal.deadline);
          const isUrgent = daysLeft < 7;
          
          return (
            <div key={goal.id} className={`${themeClasses.card} rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold ${themeClasses.text}`}>{goal.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                </div>
                <p className={`${themeClasses.accent} mb-3`}>{goal.description}</p>
                
                <div className="flex items-center space-x-4 text-sm mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className={themeClasses.accent} />
                    <span className={`${isUrgent ? 'text-red-500 font-semibold' : themeClasses.accent}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={14} className={themeClasses.accent} />
                    <span className={themeClasses.accent}>{goal.progress}% complete</span>
                  </div>
                </div>

                {/* Motivational Quote */}
                {goal.motivationalQuote && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center space-x-2">
                      <Quote size={14} className="text-blue-500" />
                      <p className="text-sm italic text-blue-700">{goal.motivationalQuote}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${themeClasses.text}`}>Progress</span>
                  <span className={`text-sm ${themeClasses.accent}`}>{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full ${themeClasses.button} transition-all duration-500 ease-out`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Progress Controls */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 text-sm"
                >
                  -10%
                </button>
                <button
                  onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                  className={`px-3 py-1 rounded ${themeClasses.button} text-sm transition-all duration-200 hover:scale-105`}
                >
                  +10%
                </button>
                <button
                  onClick={() => updateGoalProgress(goal.id, 100)}
                  className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm transition-all duration-200 hover:scale-105"
                >
                  Complete
                </button>
              </div>

              {/* Subtasks */}
              {goal.subtasks.length > 0 && (
                <div>
                  <h4 className={`text-sm font-semibold ${themeClasses.text} mb-2`}>Milestones:</h4>
                  <div className="space-y-1">
                    {goal.subtasks.map((subtask, index) => (
                      <div key={index} className={`text-sm ${themeClasses.accent} flex items-center space-x-2`}>
                        <div className={`w-2 h-2 rounded-full ${index < (goal.progress / 100) * goal.subtasks.length ? 'bg-green-400' : 'bg-gray-300'}`} />
                        <span>{subtask}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className={`${themeClasses.card} rounded-2xl p-12 text-center`}>
          <div className="text-6xl mb-4">🎯</div>
          <p className={`text-xl ${themeClasses.text} mb-2`}>No goals set yet!</p>
          <p className={`${themeClasses.accent}`}>Create your first goal to start tracking your progress.</p>
        </div>
      )}
    </div>
  );
};
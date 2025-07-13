import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { useData, Goal } from '../contexts/DataContext';

export const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'academic' as 'academic' | 'personal' | 'career'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addGoal({
      ...formData,
      progress: 0
    });

    setFormData({
      title: '',
      description: '',
      targetDate: '',
      category: 'academic'
    });
    setShowAddForm(false);
  };

  const updateProgress = (id: string, change: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const newProgress = Math.max(0, Math.min(100, goal.progress + change));
      updateGoal(id, { progress: newProgress });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'personal': return 'bg-green-100 text-green-700';
      case 'career': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Goal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Goal title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <textarea
                placeholder="Description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="academic">Academic</option>
                <option value="personal">Personal</option>
                <option value="career">Career</option>
              </select>

              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const daysLeft = getDaysUntilTarget(goal.targetDate);
          const isUrgent = daysLeft < 7 && daysLeft > 0;
          const isOverdue = daysLeft < 0;
          
          return (
            <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar size={14} />
                      <span className={
                        isOverdue ? 'text-red-600 font-medium' :
                        isUrgent ? 'text-yellow-600 font-medium' : ''
                      }>
                        {isOverdue ? 'Overdue' : 
                         daysLeft === 0 ? 'Today' :
                         daysLeft === 1 ? 'Tomorrow' :
                         `${daysLeft} days left`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                  <div className="text-xs text-gray-500">complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Progress Controls */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateProgress(goal.id, -10)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    -10%
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, 10)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    +10%
                  </button>
                </div>
                
                {goal.progress < 100 && (
                  <button
                    onClick={() => updateGoal(goal.id, { progress: 100 })}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-500">Set your first goal to start tracking progress!</p>
        </div>
      )}
    </div>
  );
};
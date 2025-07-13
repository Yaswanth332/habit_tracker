import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Flag, X, Check } from 'lucide-react';
import { useData, Task } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

interface TaskManagerProps {
  isQuickView?: boolean;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ isQuickView = false }) => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useData();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    emoji: '✨',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    tags: ''
  });

  const filteredTasks = isQuickView 
    ? tasks.filter(task => task.type === 'daily').slice(0, 3)
    : tasks.filter(task => task.type === activeTab);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const taskData = {
        title: newTask.title,
        type: activeTab,
        completed: false,
        category: newTask.category || 'General',
        emoji: newTask.emoji,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
        tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      if (editingTask) {
        updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        addTask(taskData);
      }

      setNewTask({ title: '', category: '', emoji: '✨', priority: 'medium', dueDate: '', tags: '' });
      setShowAddForm(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      category: task.category,
      emoji: task.emoji,
      priority: task.priority,
      dueDate: task.dueDate || '',
      tags: task.tags.join(', ')
    });
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowAddForm(false);
    setNewTask({ title: '', category: '', emoji: '✨', priority: 'medium', dueDate: '', tags: '' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'daily', label: 'Daily', emoji: '☀️' },
    { id: 'weekly', label: 'Weekly', emoji: '📅' },
    { id: 'monthly', label: 'Monthly', emoji: '🗓️' }
  ];

  if (isQuickView) {
    return (
      <div className={`${themeClasses.card} rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Quick Add Task</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${themeClasses.button} px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105`}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="What do you want to accomplish?"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button
                onClick={handleAddTask}
                className={`${themeClasses.button} px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105`}
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filteredTasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  task.completed 
                    ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {task.completed && <Check size={12} />}
              </button>
              <span className="text-lg">{task.emoji}</span>
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : themeClasses.text}`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Task Manager</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`${themeClasses.button} px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105`}
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
              activeTab === tab.id
                ? themeClasses.button
                : `${themeClasses.text} hover:bg-white/50`
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Add/Edit Task Form */}
      {showAddForm && (
        <div className={`${themeClasses.card} p-6 rounded-xl border-2 border-dashed ${themeClasses.border}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className={`p-2 rounded-lg ${themeClasses.text} hover:bg-gray-100 transition-colors`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Category (e.g., DSA, Physics)..."
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="🌟"
                  value={newTask.emoji}
                  onChange={(e) => setNewTask(prev => ({ ...prev, emoji: e.target.value }))}
                  className="w-16 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)..."
                value={newTask.tags}
                onChange={(e) => setNewTask(prev => ({ ...prev, tags: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAddTask}
              className={`${themeClasses.button} px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105`}
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={`${themeClasses.card} p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
              task.completed ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <span className="text-2xl">{task.emoji}</span>
                <div className="flex-1">
                  <h3 className={`font-semibold ${themeClasses.text} ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditTask(task)}
                  className={`p-1 rounded ${themeClasses.text} hover:bg-gray-100 transition-colors`}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${themeClasses.text}`}>
                {task.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.streak > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 flex items-center space-x-1`}>
                  <span>🔥</span>
                  <span>{task.streak}</span>
                </span>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                <Calendar size={12} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className={`${themeClasses.card} rounded-xl p-12 text-center`}>
          <div className="text-6xl mb-4">📝</div>
          <p className={`text-lg ${themeClasses.text}`}>No {activeTab} tasks yet!</p>
          <p className={`${themeClasses.accent}`}>Add your first task to get started.</p>
        </div>
      )}
    </div>
  );
};
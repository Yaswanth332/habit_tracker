import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  streak: number;
  category: string;
  emoji: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  subtasks: string[];
  category: string;
  motivationalQuote?: string;
}

export interface WorkSession {
  id: string;
  project: string;
  duration: number;
  tags: string[];
  date: string;
  notes: string;
  mood?: string;
}

export interface Reflection {
  id: string;
  date: string;
  prompt: string;
  response: string;
  mood: string;
}

interface DataContextType {
  tasks: Task[];
  goals: Goal[];
  workSessions: WorkSession[];
  reflections: Reflection[];
  totalStreak: number;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'streak'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  addWorkSession: (session: Omit<WorkSession, 'id'>) => void;
  addReflection: (reflection: Omit<Reflection, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revise Linked Lists',
      type: 'daily',
      completed: true,
      streak: 3,
      category: 'DSA',
      emoji: '🔗',
      priority: 'high',
      tags: ['coding', 'interview-prep'],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Finish Lab Report',
      type: 'weekly',
      completed: false,
      streak: 0,
      category: 'Physics',
      emoji: '⚗️',
      dueDate: '2025-01-15',
      priority: 'high',
      tags: ['lab', 'assignment'],
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Drink 8 glasses of water',
      type: 'daily',
      completed: false,
      streak: 5,
      category: 'Health',
      emoji: '💧',
      priority: 'medium',
      tags: ['health', 'habit'],
      createdAt: new Date().toISOString()
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete DSA Course',
      description: 'Finish 70% of the Data Structures and Algorithms course before semester ends',
      deadline: '2025-05-15',
      progress: 45,
      subtasks: ['Arrays & Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
      category: 'Academic',
      motivationalQuote: 'Code is poetry written in logic! 💻✨'
    },
    {
      id: '2',
      title: 'Build Portfolio Website',
      description: 'Create a professional portfolio to showcase projects',
      deadline: '2025-03-01',
      progress: 20,
      subtasks: ['Design mockups', 'Frontend development', 'Deploy to Vercel'],
      category: 'Career'
    }
  ]);

  const [workSessions, setWorkSessions] = useState<WorkSession[]>([
    {
      id: '1',
      project: 'DSA Practice',
      duration: 120,
      tags: ['coding', 'leetcode'],
      date: new Date().toISOString().split('T')[0],
      notes: 'Solved 5 medium problems on binary trees',
      mood: '🧠'
    },
    {
      id: '2',
      project: 'React Portfolio',
      duration: 90,
      tags: ['frontend', 'react'],
      date: new Date().toISOString().split('T')[0],
      notes: 'Built the hero section with animations',
      mood: '🚀'
    }
  ]);

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [totalStreak, setTotalStreak] = useState(7);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'streak'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      streak: 0
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        const newStreak = newCompleted ? task.streak + 1 : Math.max(0, task.streak - 1);
        return { ...task, completed: newCompleted, streak: newStreak };
      }
      return task;
    }));
    
    // Update total streak
    const completedTasks = tasks.filter(t => t.completed).length;
    if (completedTasks > 0) {
      setTotalStreak(prev => prev + 1);
    }
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, progress } : goal
    ));
  };

  const addWorkSession = (session: Omit<WorkSession, 'id'>) => {
    const newSession = { ...session, id: Date.now().toString() };
    setWorkSessions(prev => [newSession, ...prev]);
  };

  const addReflection = (reflection: Omit<Reflection, 'id'>) => {
    const newReflection = { ...reflection, id: Date.now().toString() };
    setReflections(prev => [newReflection, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      tasks,
      goals,
      workSessions,
      reflections,
      totalStreak,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addGoal,
      updateGoalProgress,
      addWorkSession,
      addReflection
    }}>
      {children}
    </DataContext.Provider>
  );
};
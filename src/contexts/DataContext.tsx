import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../services/DatabaseService';

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
  isLoading: boolean;
  error: string | null;
  isConnectedToDatabase: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'streak'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  addWorkSession: (session: Omit<WorkSession, 'id'>) => Promise<void>;
  addReflection: (reflection: Omit<Reflection, 'id'>) => Promise<void>;
  initializeDatabase: (config?: any) => Promise<void>;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [totalStreak, setTotalStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnectedToDatabase, setIsConnectedToDatabase] = useState(true); // Always true for localStorage

  const initializeDatabase = async (config?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Initializing localStorage...');
      await loadAllData();
      
      setIsConnectedToDatabase(true);
      console.log('LocalStorage initialized successfully');
    } catch (err) {
      console.error('Failed to initialize localStorage:', err);
      setError(`Failed to initialize storage: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsConnectedToDatabase(false);
      loadSampleData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [tasksData, goalsData, workSessionsData, reflectionsData, streakData] = await Promise.all([
        DatabaseService.getAllTasks(),
        DatabaseService.getAllGoals(),
        DatabaseService.getAllWorkSessions(),
        DatabaseService.getAllReflections(),
        DatabaseService.getTotalStreak()
      ]);

      setTasks(tasksData);
      setGoals(goalsData);
      setWorkSessions(workSessionsData);
      setReflections(reflectionsData);
      setTotalStreak(streakData);
    } catch (err) {
      console.error('Failed to load data:', err);
      throw err;
    }
  };

  const loadSampleData = () => {
    // Sample data for initial setup
    setTasks([
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
      }
    ]);

    setGoals([
      {
        id: '1',
        title: 'Complete DSA Course',
        description: 'Finish 70% of the Data Structures and Algorithms course before semester ends',
        deadline: '2025-05-15',
        progress: 45,
        subtasks: ['Arrays & Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
        category: 'Academic',
        motivationalQuote: 'Code is poetry written in logic! 💻✨'
      }
    ]);

    setWorkSessions([
      {
        id: '1',
        project: 'DSA Practice',
        duration: 120,
        tags: ['coding', 'leetcode'],
        date: new Date().toISOString().split('T')[0],
        notes: 'Solved 5 medium problems on binary trees',
        mood: '🧠'
      }
    ]);

    setTotalStreak(7);
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'streak'>) => {
    try {
      const id = await DatabaseService.createTask(task);
      const newTask = {
        ...task,
        id,
        createdAt: new Date().toISOString(),
        streak: 0
      };
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await DatabaseService.updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await DatabaseService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newCompleted = !task.completed;
      const newStreak = newCompleted ? task.streak + 1 : Math.max(0, task.streak - 1);
      
      const updates = { completed: newCompleted, streak: newStreak };
      
      await DatabaseService.updateTask(id, updates);
      
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ));
      
      // Update total streak
      if (newCompleted) {
        const newTotalStreak = totalStreak + 1;
        setTotalStreak(newTotalStreak);
        await DatabaseService.updateTotalStreak(newTotalStreak);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      setError('Failed to toggle task');
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      const id = await DatabaseService.createGoal(goal);
      const newGoal = { ...goal, id };
      setGoals(prev => [newGoal, ...prev]);
    } catch (err) {
      console.error('Failed to add goal:', err);
      setError('Failed to add goal');
    }
  };

  const updateGoalProgress = async (id: string, progress: number) => {
    try {
      await DatabaseService.updateGoalProgress(id, progress);
      setGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, progress } : goal
      ));
    } catch (err) {
      console.error('Failed to update goal progress:', err);
      setError('Failed to update goal progress');
    }
  };

  const addWorkSession = async (session: Omit<WorkSession, 'id'>) => {
    try {
      const id = await DatabaseService.createWorkSession(session);
      const newSession = { ...session, id };
      setWorkSessions(prev => [newSession, ...prev]);
    } catch (err) {
      console.error('Failed to add work session:', err);
      setError('Failed to add work session');
    }
  };

  const addReflection = async (reflection: Omit<Reflection, 'id'>) => {
    try {
      const id = await DatabaseService.createReflection(reflection);
      const newReflection = { ...reflection, id };
      setReflections(prev => [newReflection, ...prev]);
    } catch (err) {
      console.error('Failed to add reflection:', err);
      setError('Failed to add reflection');
    }
  };

  // Initialize with data on mount
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <DataContext.Provider value={{
      tasks,
      goals,
      workSessions,
      reflections,
      totalStreak,
      isLoading,
      error,
      isConnectedToDatabase,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addGoal,
      updateGoalProgress,
      addWorkSession,
      addReflection,
      initializeDatabase
    }}>
      {children}
    </DataContext.Provider>
  );
};
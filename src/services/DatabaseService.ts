import { LocalStorageService } from '../config/database';
import { Task, Goal, WorkSession, Reflection } from '../contexts/DataContext';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseService {
  // Tasks
  static async getAllTasks(): Promise<Task[]> {
    const tasks = LocalStorageService.getData('tasks') || [];
    return tasks.sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'streak'>): Promise<string> {
    const id = uuidv4();
    const newTask = {
      ...task,
      id,
      createdAt: new Date().toISOString(),
      streak: 0
    };
    
    const tasks = await this.getAllTasks();
    tasks.unshift(newTask);
    LocalStorageService.saveData('tasks', tasks);
    
    return id;
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      LocalStorageService.saveData('tasks', tasks);
    }
  }

  static async deleteTask(id: string): Promise<void> {
    const tasks = await this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    LocalStorageService.saveData('tasks', filteredTasks);
  }

  // Goals
  static async getAllGoals(): Promise<Goal[]> {
    const goals = LocalStorageService.getData('goals') || [];
    return goals;
  }

  static async createGoal(goal: Omit<Goal, 'id'>): Promise<string> {
    const id = uuidv4();
    const newGoal = { ...goal, id };
    
    const goals = await this.getAllGoals();
    goals.unshift(newGoal);
    LocalStorageService.saveData('goals', goals);
    
    return id;
  }

  static async updateGoalProgress(id: string, progress: number): Promise<void> {
    const goals = await this.getAllGoals();
    const goalIndex = goals.findIndex(goal => goal.id === id);
    
    if (goalIndex !== -1) {
      goals[goalIndex].progress = progress;
      LocalStorageService.saveData('goals', goals);
    }
  }

  // Work Sessions
  static async getAllWorkSessions(): Promise<WorkSession[]> {
    const sessions = LocalStorageService.getData('workSessions') || [];
    return sessions.sort((a: WorkSession, b: WorkSession) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async createWorkSession(session: Omit<WorkSession, 'id'>): Promise<string> {
    const id = uuidv4();
    const newSession = { ...session, id };
    
    const sessions = await this.getAllWorkSessions();
    sessions.unshift(newSession);
    LocalStorageService.saveData('workSessions', sessions);
    
    return id;
  }

  // Reflections
  static async getAllReflections(): Promise<Reflection[]> {
    const reflections = LocalStorageService.getData('reflections') || [];
    return reflections.sort((a: Reflection, b: Reflection) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async createReflection(reflection: Omit<Reflection, 'id'>): Promise<string> {
    const id = uuidv4();
    const newReflection = { ...reflection, id };
    
    const reflections = await this.getAllReflections();
    reflections.unshift(newReflection);
    LocalStorageService.saveData('reflections', reflections);
    
    return id;
  }

  // User Settings
  static async getTotalStreak(): Promise<number> {
    const streak = LocalStorageService.getData('totalStreak');
    return streak ? parseInt(streak) : 0;
  }

  static async updateTotalStreak(streak: number): Promise<void> {
    LocalStorageService.saveData('totalStreak', streak.toString());
  }
}